class ReduxEvents {
    constructor () {
        this.listeners = []
    }

    registerListener (listeners) {
        this.listeners = this.listeners.concat(listeners)
    }

    createReduxMiddleware (ctx) {
        return store => next => (action) => {
            // console.log(`EVENT: ${action.type}`)
            // console.log(listeners)
            this.listeners
                .filter(listener => listener.type === action.type)
                .forEach((listener) => {
                    try {
                        if (listener.async) {
                            setTimeout(() => listener.handler(action, ctx)(store.dispatch, store.getState))
                        } else {
                            listener.handler(action, ctx)(store.dispatch, store.getState)
                        }
                    } catch (e) {
                        // eslint-disable-next-line
                        console.error('Redux event handler error')
                    }
                })

            return next(action)
        }
    }
}

export default ReduxEvents
