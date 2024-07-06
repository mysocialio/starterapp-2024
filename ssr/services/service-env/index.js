/**
 * Extends `process.env` with informations from local files:
 *
 * .env
 * .env.local
 * .env.[development|production|...]
 * .env.[development|production|...].local
 *
 */

import path from 'path'
import fs from 'fs'
import nodeEnvFile from 'node-env-file'
import * as hooks from './hooks'
import { getEnv } from './get-env'

const fileExists = filePath => new Promise(resolve => {
    fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
            resolve(false)
        } else {
            resolve(true)
        }
    })
})

const loadEnv = async (fileName, root, options) => {
    const filePath = path.join(root, fileName)
    if (await fileExists(filePath)) {
        nodeEnvFile(filePath, options)
    }
}

const initEnv = async (args, ctx) => {
    const cwd = args.cwd || process.cwd()
    await loadEnv('.env', cwd, { overwrite: false })
    await loadEnv('.env.local', cwd, { overwrite: true })
    await loadEnv(`.env.${process.env.NODE_ENV}`, cwd, { overwrite: true })
    await loadEnv(`.env.${process.env.NODE_ENV}.local`, cwd, { overwrite: true })

    // Decorate the context with an evironment variable getter
    ctx.getEnv = getEnv
}

export default ({ registerAction }) =>
    registerAction({
        hook: '$START',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: initEnv,
    })
