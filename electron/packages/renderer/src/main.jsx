import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './App'
import { ThemeProvider } from 'react-jss'
import {
    ThemeProvider as MUIThemeProvider,
    StyledEngineProvider,
    createTheme,
    CssBaseline
} from '@mui/material'

const theme = createTheme({
    colors: {
        background: {
            primary: '#292E39',
            secondary: '#2E3440',
            highlight: '#434C5D'
        },
 
        accent: {
            red: '#BF616A',
            orange: '#D0866F',
            yellow: '#EBCB8B',
            green: '#A3BE8C',
            pink: '#B48DAD',
        },

        white: [
            '#D8DEE9', '#E5E9F0', '#ECEFF4', '#F5F7FA', '#F9F9F9', '#FFFFFF'
        ],

        frost: [
            '#8FBCBB', '#88C0D0', '#81A1C1', '#5E81AC', '#3E6C7E', '#1D4F5F'
        ],

        text: {
            primary: '#ECEFF4',
            secondary: '#E5E9F0',
            muted: '#D8DEE9'
        }
    },

    boxShadow: [
        'rgb(15 17 21 / 20%) 0px 3px 6px 0px',
        '0px 5px 6px -3px rgb(0 0 0 / 20%), 0px 9px 12px 1px rgb(0 0 0 / 14%), 0px 3px 16px 2px rgb(0 0 0 / 12%)'
    ],

    radius: [
        '0.25rem', '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem'
    ],

    //MUI Overrides
    palette: {
        mode: 'dark',

        background: {
            default: '#292E39'
        },

        primary: {
            main: '#292E39',
            contrastText: '#ECEFF4'
        },

        secondary: {
            main: '#2E3440',
            contrastText: '#ECEFF4'
        },

        tertiary: {
            main: '#434C5D',
            contrastText: '#ECEFF4'
        },

        warning: {
            main: '#ffa726',
            contrastText: '#fff'
        },

        success: {
            main: '#66bb6a',
            contrastText: '#fff'
        },

        accent: {
            main: '#BF616A',
        }
    },

    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#292E39',
                    borderRadius: '0.75rem',
                }
            }
        }
    }
})

render(
    <StrictMode>
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <StyledEngineProvider>
                    <App />
                </StyledEngineProvider>
            </ThemeProvider>
        </MUIThemeProvider>
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
