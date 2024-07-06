import { createRouter } from './create-router'
import * as hooks from './hooks'

export default ({ registerHook, registerAction, createHook }) => {
    registerHook(hooks)
    registerAction({
        hook: '$EXPRESS_HANDLER',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ registerHandler }, { getConfig }) => {
            const options = getConfig('expressSSR', {})
            await createHook.serie(hooks.EXPRESS_SSR, { options })
            registerHandler(createRouter(options))
        },
        priority: -999,
        route: '/',
    })
}
