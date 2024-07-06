import createSSRState from './lib/state-setup/create-ssr-state'

const reducers = {
    app: (state, action) => {
        return {
            id: process.env.REACT_APP_ID || 'react-ssr',
            name: process.env.REACT_APP_NAME || 'React SSR',
        }
    },
}

const features = require('./features').default

export const createState = createSSRState(reducers, features)
