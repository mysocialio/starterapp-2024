import PGPubsub from 'pg-pubsub'

import pause from 'lib/pause'
import { logInfo, logVerbose, logDebug, logError } from 'ssr/services/service-logger'
import { getHandler, pushModel, getModel } from './conn'

const establishConnection = async (conn, maxAttempts, attemptDelay) => {
    let attempts = 0
    let lastErrorMSG = ''
    do {
        try {
            logVerbose(`[postgres]  Connection attempt ${attempts + 1}/${maxAttempts} to "${conn.name}"`)
            await conn.handler.authenticate()
            return true
        } catch (err) {
            attempts += 1
            lastErrorMSG = err.message
            logError(`[postgres] failed connection "${conn.name}" - ${err.message}`)
            logDebug(err)
            await pause(attemptDelay)
        }
    } while (attempts < maxAttempts)

    throw new Error(lastErrorMSG)
}

const initModels = async (conn, models) => {
    const promises = models.map(model => new Promise(async (resolve, reject) => {
        try {
            logVerbose(`[posgres] init model "${model.name}" in "${conn.name}"`)
            const instance = await model.init(conn.handler, conn.hooksContext)
            pushModel(conn, instance)
            resolve()
        } catch (err) {
            logError(`[postgres] failed to init model "${model.name}" in "${conn.name}" - ${err.message}`)
            logDebug(err)
            reject(new Error({ model, err }))
        }
    }))

    return Promise.all(promises)
}

const startModels = async (conn, models) => {
    const promises = models.map(model => new Promise(async (resolve, reject) => {
        if (!model.start) {
            return resolve()
        }
        try {
            logVerbose(`[postgres] start model "${model.name}" in "${conn.name}"`)
            await model.start(conn.handler, getModel(model.name, conn.name), conn.hooksContext)
            resolve()
        } catch (err) {
            logError(`[postgres] failed to start model "${model.name}" in "${conn.name}" - ${err.message}`)
            logDebug(err)
            reject(new Error({ model, err }))
        }
    }))

    return Promise.all(promises)
}

export default async ({ schemas, models, maxAttempts, attemptDelay, ...config }) => {
    logInfo('[postgres] start')
    const name = config.connectionName || 'default'
    const conn = getHandler(name)

    try {
        await establishConnection(conn, maxAttempts, attemptDelay)
    } catch (err) {
        throw new Error(`[postgres] connection failed "${name}" - ${err.message}`)
    }

    // Allow to run free queries right after connection was established
    try {
        if (config.onConnection) {
            await config.onConnection(conn)
        }
    } catch (err) {
        throw new Error(`[postgres] onConnection hook failed for "${name}" - ${err.message}`)
    }

    // Create custom schemas
    if (schemas) {
        const schemasP = schemas.map(schema => conn.handler.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`))
        await Promise.all(schemasP)
    }

    // Initialize models
    try {
        await initModels(conn, models)
    } catch (err) {
        throw new Error(`[postgres] init models failed for "${name}": ${err.model.name}, ${err.err.message}`)
    }

    try {
        if (config.afterInitModels) {
            await config.afterInitModels(conn)
        }
    } catch (err) {
        throw new Error(`[postgres] afterInitModels hook failed for "${name}" - ${err.message}`)
    }

    try {
        await startModels(conn, models)
    } catch (err) {
        throw new Error(`[postgres] start models failed for "${name}": ${err.model.name}, ${err.err.message}`)
    }

    if (config.enablePubSub) {
        try {
            conn.emitter = new PGPubsub(config.connectionString)
            logInfo('[postgres] pubsub enabled')
        } catch (err) {
            throw new Error(`pg pubsub failed - ${err.message}`)
        }
    }

    try {
        if (config.afterStartModels) {
            await config.afterStartModels(conn)
        }
    } catch (err) {
        throw new Error(`[postgres] afterStartModels hook failed for "${name}" - ${err.message}`)
    }
}
