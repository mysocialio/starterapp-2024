import { Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/AuthPages'

const App = () => {
    return (
        <>
            <Routes>
                <Route
                    path={'/'}
                    element={<HomePage/>}
                />
                <Route
                    path={'/about'}
                    element={<div>About</div>}
                />
            </Routes>
        </>
    )
}

export default App
