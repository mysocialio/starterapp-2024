import jwt from 'jsonwebtoken'
import * as hooks from './hooks'

let secret = null
let duration = null
let settings = {}

export const sign = (payload, customSettings = settings, customSecret = secret) =>
    new Promise((resolve, reject) => {
        const localSettings = {
            ...customSettings,
            expiresIn: customSettings.expiresIn || duration,
        }

        jwt.sign({ payload }, customSecret, localSettings, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })

export const verify = (token, customSecret = secret) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, customSecret, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

export const decode = (token, options) => jwt.decode(token, options)

export default ({ registerAction }) =>
    registerAction({
        hook: '$INIT_SERVICE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ getConfig }, ctx) => {
            secret = getConfig('service.jwt.secret')
            duration = getConfig('service.jwt.duration')
            settings = getConfig('service.jwt.settings', {})

            // Decorate the context
            ctx.jwt = { sign, verify, decode }
        },
    })

