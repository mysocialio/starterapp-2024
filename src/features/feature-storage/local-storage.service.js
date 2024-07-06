const getKeyName = name => (dispatch, getState) => {
    const { storage } = getState()
    return `${storage.scope}::${name}`
}

export const setItem = (key, value) => (dispatch, getState) => {
    const { ssr } = getState()
    if (ssr.isServer()) return

    const keyName = dispatch(getKeyName(key))
    window.localStorage.setItem(keyName, JSON.stringify(value))
}

export const getItem = (key, defaultValue = undefined) => (dispatch, getState) => {
    const { ssr } = getState()
    if (ssr.isServer()) return

    const keyName = dispatch(getKeyName(key))
    return JSON.parse(window.localStorage.getItem(keyName)) || defaultValue
}

export const removeItem = key => (dispatch, getState) => {
    const { ssr } = getState()
    if (ssr.isServer()) return

    const keyName = dispatch(getKeyName(key))
    window.localStorage.removeItem(keyName)
}
