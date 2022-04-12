import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(4),
        flexWrap: 'wrap'
    }
}))

const Event = () => {
    const classes = useStyles()

    const { eventId } = useParams()

    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(async () => {
        const res = await Axios.get(`/events/${eventId}`) .catch(err => console.log(err))

        if ( !(res.data instanceof Array) )
            setEvent([])

        setEvent(res.data[0])
        setLoading(false)
        console.log(res.data[0])
    }, [])

    return (
        <div className={classes.root}>

        </div>
    )
}

export default Event