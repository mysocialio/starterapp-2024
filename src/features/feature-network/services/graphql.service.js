/**
 * Options:
 * - debug:        (bool: false)
 * - ignoreErrors: (bool: false) avoid to throw in case of graphql errors
 * - endpoint:     (string: null) provide a custom http endpoint
 *
 * Returns:
 * { data: {}, errors: [] }
 */

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
    // const status = res.status
    const json = await res.json()

    if (json.errors) {
        throw new Error(`${json.errors[0].message}`)
    }

    return json

    // if (res.status !== 200) {
    //     const error = new Error(`${res.status} - ${res.statusText}`)
    //     error.response = res
    //     try {
    //         error.body = await res.json()
    //     } catch (err) {} // eslint-disable-line
    //     throw error
    // }

    // return await res.json()
}

export const runQuery = (query = null, variables = {}, options = {}) =>
    async (dispatch, getState) => {
        const { ssr, network } = getState()
        if (!query) throw new Error('please provide a query')
        if (!network.isOnline) throw new Error('offline') // pause if network is not online

        const { debug, ignoreErrors, ...otherOptions } = options
        const endpoint = options.endpoint || ssr.getApiUrl('')

        const fetchOptions = {
            credentials: 'include',
            ...otherOptions,
        }

        // SSR: forward cookies and auth headers
        if (process.env.REACT_SSR) {
            const req = ssr.getRequestHandler()
            fetchOptions.headers = {
                ...(otherOptions.headers || {}),
                Cookie: req.headers.cookie,
            }
        }

        if (debug) {
            console.log('>>>>>>>>>>>> GRAPHQL')
            console.log(endpoint)
            console.log(query)
            console.log(variables)
            console.log(fetchOptions)
            console.log(JSON.stringify(variables))
            console.log('<<<<<<<<<<< GRAPHQL')
        }

        const result = await dispatch(postJSON(endpoint, {
            query,
            variables,
        }, fetchOptions))

        return result

        // try {
        //     result = await dispatch(postJSON(endpoint, {
        //         query,
        //         variables,
        //     }, fetchOptions))
        // } catch (err) {
        //     // must be a real network error
        //     if (!err.response) {
        //         const error = new Error(`${err.message}`)
        //         error.query = query
        //         error.originalError = err
        //         throw error
        //     }

        //     // might be a graphql handled error
        //     try {
        //         result = JSON.parse(await err.response.text())
        //     } catch (jsonErr) {
        //         throw err
        //     }
        // }

        // if (result.errors && ignoreErrors !== true) {
        //     const error = new Error(result.errors[0].message)
        //     error.graphQLErrors = result.errors
        //     error.graphQLResponse = result
        //     throw error
        // }
    }
