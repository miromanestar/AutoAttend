import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'sticky',
        top: '100%',
        padding: theme.spacing(1),
        color: theme.colors.background.highlight
    }
}))

const Footer = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            Copyright &copy; 2022 Miro Manestar. All Rights Reserved.
        </div>
    )
}

export default Footer