
import { getHandler } from './conn'

export const getEmitter = (conn) =>
    getHandler(conn).emitter

export const listen = (conn, channel, fn = () => {}) => {
    const emitter = getEmitter(conn)
    emitter && emitter.addChannel(channel)
    emitter && emitter.once(channel, fn)
}

export const publish = (conn, channel, payload, throttle = 0) => {
    // setup timers cache at first execution
    if (!publish.timers) {
        publish.timers = {}
    }

    clearTimeout(publish.timers[`${channel}`])
    publish.timers[`${channel}`] = setTimeout(() => {
        return getHandler(conn).emitter.publish(channel, payload)
    }, throttle)
}
