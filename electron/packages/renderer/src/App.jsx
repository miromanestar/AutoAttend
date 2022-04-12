import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { createUseStyles } from 'react-jss'

import Home from './views/Home'
import Event from './views/Event'

import ResponsiveNavbar from './components/ResponsiveNavbar'

const useStyles = createUseStyles(theme => ({
    root: {
        backgroundColor: theme.colors.background.primary,
        height: '100vh'
    }
}))

const App = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <HashRouter>
                <ResponsiveNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Home />} />
                    <Route path="/events/:eventId" element={<Event />} />
                </Routes>
            </HashRouter>
        </div>
    )
}

export default App
