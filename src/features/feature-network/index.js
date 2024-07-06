/**
 * Provides ways to use and sense the network
 *
 */

import * as networkStatusService from './services/network-status.service'

export const reducers = {
    network: require('./network.reducer').default,
}
export const services = [
    networkStatusService,
]
export const listeners = []

export { postJSON, getJSON, deleteJSON } from './services/fetch.service'
export { runQuery } from './services/graphql.service'
