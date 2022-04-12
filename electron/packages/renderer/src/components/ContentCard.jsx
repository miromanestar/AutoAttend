import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    Paper,
    Typography
} from '@mui/material'
import clsx from 'clsx'

const useStyles = createUseStyles(theme => ({
    root: {
        borderRadius: '0.75rem !important',
        transition: '0.2s ease-in-out !important',
        backgroundColor: `${theme.colors.background.secondary} !important`,
    },

    title: {
        textAlign: 'center',
        marginRight: '24px',
        marginLeft: '24px',
        padding: theme.spacing(2),
        borderRadius: '0.75rem !important',
        position: 'relative',
        top: '-24px',
        color: 'white !important',
        backgroundColor: `${theme.colors.accent.red} !important`
    },

    subtitle: {
        textAlign: 'center',
    },

    content: {
        margin: theme.spacing(0, 4),
        padding: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    },

    feature: {
        padding: theme.spacing(1),
        color: theme.palette.mutedText
    }
}))

const ContentCard = ({ title, subtitle, cls, children }) => {
    const classes = useStyles()

    return (
        <Paper className={clsx(classes.root, cls)} elevation={7}>
            <Paper className={classes.title} elevation={4}>
                <Typography variant="h4">{title}</Typography>
            </Paper>
            <Typography className={classes.subtitle} variant="h4">{subtitle}</Typography>
            <div className={classes.content}>
                {children}
            </div>
        </Paper>
    )
}

export default ContentCard