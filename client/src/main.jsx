import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import './index.css'
import App from './App'

const theme = {

}

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
