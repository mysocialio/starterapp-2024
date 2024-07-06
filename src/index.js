import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles'
import App from './App'
import { createState } from './app.state'

/**
 * It's likely that the server will provide the production `initialState``
 * via the global variable.
 *
 * Here you can provide some static state for development pourpose.
 * Anyway, it's best if you set it up as `defaultState` in each reducer
 */
const initialState = window.SERVER_DATA || {}

createState(initialState)
    .then(({ store, ...props }) => {
        const root = ReactDOM.createRoot(document.getElementById('root'))
        root.render(
            <React.StrictMode>
                <Router>
                    <Provider store={store}>
                        <App {...props}/>
                    </Provider>
                </Router>
            </React.StrictMode>,
        )
    })
    .catch(err => console.error(err))
