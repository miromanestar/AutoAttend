import React from 'react'
import styles from '@/styles/app.module.scss'
import Camera from './views/Camera'

const App = () => {

    return (
        <div className={styles.app}>
            <header className={styles.appHeader}>
                <div className={styles.logos}>
                    <Camera />
                </div>
            </header>
        </div>
    )
}

export default App
