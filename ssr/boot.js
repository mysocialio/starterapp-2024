import hookApp from '@alialfredji/hook-app'
import { GraphQLString } from 'graphql'

export default hookApp.run({
    trace: process.env.NODE_ENV === 'development',
    services: [
        require('./services/service-env'),
        require('./services/service-logger'),
        require('./services/service-jwt'),
        require('./services/service-express'),
        require('./services/service-express-graphql'),
        require('./services/service-express-cookies'),
        require('./services/service-express-ssr'),
        require('./services/service-postgres'),
    ],
    features: [
        // test graphql
        ['$EXPRESS_GRAPHQL', ({ registerQuery }) => {
            registerQuery('helloworld', {
                type: GraphQLString,
                resolve: () => 'Hello World',
            })
        }],
    ],
    settings: async ({ setConfig, getEnv }) => {
        setConfig('service.express-cookies', {
            scope: getEnv('REACT_APP_ID'),
            httpOnly: true,
            duration: '1d',
        })

        setConfig('service.jwt', {
            secret: getEnv('JWT_SECRET'),
            duration: '1d',
        })

        setConfig('service.postgres.connections', [
            {
                connectionName: 'default',
                connectionString: getEnv('PG_STRING'),
                schemas: [],
                enablePubSub: false,
            },
        ])
    },
})
