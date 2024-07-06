const path = require('path')
const nodeEnvFile = require('node-env-file')

// Load project's `.env*` files
nodeEnvFile(path.join(process.cwd(), '.env'), { overwrite: false, raise: false })
nodeEnvFile(path.join(process.cwd(), '.env.local'), { overwrite: true, raise: false })
nodeEnvFile(path.join(process.cwd(), `.env.${process.env.NODE_ENV}`), { overwrite: true, raise: false })
nodeEnvFile(path.join(process.cwd(), `.env.${process.env.NODE_ENV}.local`), { overwrite: true, raise: false })

function preset (_, options = {}) {
    const { debug = false } = options
    const { NODE_ENV, BABEL_ENV } = process.env

    const PRODUCTION = (BABEL_ENV || NODE_ENV) === 'production'

    return {
        presets: [
            [
                require.resolve('@babel/preset-env'),
                Object.assign(
                    {
                        loose: false,
                        debug: !!debug,
                        useBuiltIns: false,
                        shippedProposals: true,
                        modules: 'commonjs',
                        targets: {
                            browsers: PRODUCTION
                                ? [ 'last 4 versions', 'safari >= 7', 'ie >= 9' ]
                                : [ 'last 2 versions', 'not ie <= 11', 'not android 4.4.3' ],
                        },
                    },
                ),
            ],
            [ require.resolve('@babel/preset-react'), { development: !PRODUCTION } ],
        ],
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [ 'src', 'ssr', '.' ],
                },
            ],
        ],
    }
}

module.exports = preset
