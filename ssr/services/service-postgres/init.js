import Sequelize from 'sequelize'
import { logInfo, logDebug } from 'ssr/services/service-logger'
import { addHandler } from './conn'

export default (config, hooksContext) => {
    logInfo('[postgres] init')
    const name = config.connectionName || 'default'
    let handler = null

    if (config.connectionString) {
        handler = new Sequelize(config.connectionString, {
            logging: config.logging || logDebug,
            ...(config.pool ? { pool: config.pool } : {}),
        })
    } else {
        handler = new Sequelize(config.database, config.username, config.password, {
            dialect: 'postgres',
            host: config.host,
            port: config.port,
            logging: config.logging || logDebug,
            ...(config.pool ? { pool: config.pool } : {}),
        })
    }

    addHandler(name, {
        name,
        config,
        handler,
        hooksContext,
    })
}
