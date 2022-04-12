import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

import Camera from '../components/Camera'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(4),
        flexWrap: 'wrap'
    },

    camera: {
        height: '30%',
        borderRadius: theme.radius[2]
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
            <div className={classes.camera}>
                <Camera />
            </div>
        </div>
    )
}

export default Event