import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './App'
import { ThemeProvider } from 'react-jss'
import './samples/electron-store'
import './styles/index.css'

const theme = {

}

render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </StrictMode>,
    document.getElementById('root'),
    window.removeLoading
)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)

// Usage of ipcRenderer.on
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
})
