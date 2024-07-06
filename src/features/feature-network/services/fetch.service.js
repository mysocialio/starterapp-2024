export const postJSON = (url, data = {}, options = {}) => async (dispatch, getState) => {
    const { ssr } = getState()

    const headers = {
        ...options.headers,
        'content-type': 'application/json',
    }

    const fetchOptions = {
        ...options,
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
    }

    const res = await ssr.await(fetch(url, fetchOptions))

    if (res.status !== 200) {
        const error = new Error(`${res.status} - ${res.statusText}`)
        error.response = res
        try {
            error.body = await res.json()
        } catch (err) {} // eslint-disable-line
        throw error
    }

    return await res.json()
}

export const getJSON = (url, options = {}) => async (dispatch, getState) => {
    const { ssr } = getState()

    const headers = {
        ...options.headers,
        'content-type': 'application/json',
    }

    const fetchOptions = {
        ...options,
        method: 'GET',
        headers,
        credentials: 'include',
    }

    const res = await ssr.await(fetch(url, fetchOptions))

    if (res.status !== 200) {
        const error = new Error(`${res.status} - ${res.statusText}`)
        error.response = res
        try {
            error.body = await res.json()
        } catch (err) {} // eslint-disable-line
        throw error
    }

    return await res.json()
}

export const deleteJSON = (url, options = {}) => async (dispatch, getState) => {
    const { ssr } = getState()

    const headers = {
        ...options.headers,
        'content-type': 'application/json',
    }

    const fetchOptions = {
        ...options,
        method: 'DELETE',
        headers,
        credentials: 'include',
    }

    const res = await ssr.await(fetch(url, fetchOptions))

    if (res.status !== 200) {
        const error = new Error(`${res.status} - ${res.statusText}`)
        error.response = res
        try {
            error.body = await res.json()
        } catch (err) {} // eslint-disable-line
        throw error
    }

    return await res.json()
}
