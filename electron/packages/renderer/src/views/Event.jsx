import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    Typography,
    Button,
    CircularProgress,
    Icon
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

import PersonIcon from '@mui/icons-material/Person'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import Camera from '../components/Camera'
import ContentCard from '../components/ContentCard'
import SearchInput from '../components/SearchInput'
import EventForm from '../components/EventForm'

const useStyles = createUseStyles(theme => ({
    root: {
        
    },

    row: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(4),
        padding: theme.spacing(2),
        flexWrap: 'wrap',
        marginBottom: theme.spacing(4)
    },

    camera: {
        height: '30%',
        borderRadius: theme.radius[2]
    },

    participants: {
        flex: 1,
        maxHeight: 'initial'
    },

    form: {
        display: 'flex',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        justifyContent: 'center'
    },

    participant: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: theme.spacing(2)
    },

    identifications: {
        justifyContent: 'space-between',
        flexGrow: 1
    }
}))

const Event = () => {
    const classes = useStyles()

    const { eventId } = useParams()

    const [event, setEvent] = useState(null)
    const [participants, setParticipants] = useState([])
    const [detections, setDetections] = useState({})
    const [loading, setLoading] = useState(true)

    const [run, setRun] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [newParticipant, setNewParticipant] = useState(null)

    const addParticipant = async (e) => {
        e.preventDefault()

        const res = await Axios.post(`/events/${eventId}/participants`, {
            user_id: newParticipant.id
        }).catch(err => console.log(err))

        getParticipants()
    }

    const getEvent = async () => {
        const res = await Axios.get(`/events/${eventId}`).catch(err => console.log(err))
        setEvent(res.data[0])
    }
    
    const getParticipants = async () => {
        const res = await Axios.get(`/events/${eventId}/participants`).catch(err => console.log(err))
        setParticipants(res.data?.data || [])
    }

    const deleteParticipant = async (id) => {
        await Axios.delete(`/events/${eventId}/participants/${id}`).catch(err => console.log(err))
        getParticipants()
    }

    const handleDetections = (dets) => {
        const newDets = detections
        dets.forEach(d => {
            const count = newDets[d.id]?.count + 1 || 1
            const total_score = newDets[d.id]?.total_score + d.score || d.score
            newDets[d.id] = { 
                ...d, 
                count: count,
                total_score: total_score,
                avg_score: total_score / count
            }
        })

        setDetections({...newDets})
    }

    useEffect(async () => {
        Promise.all([getEvent(), getParticipants()]).then(() => setLoading(false))
    }, [])

    const ParticipantForm = () => (
        <form className={classes.form} onSubmit={addParticipant}>
            <SearchInput
                url="/users"
                label="Users"
                name="user"
                getOptionLabel={(option) => option.name}
                onChange={(val) => setNewParticipant(val)}
            />
            <Button type="submit" variant="contained" color="warning">ADD</Button>
        </form>
    )

    if (loading) {
        return (
            <div className={classes.root}>
                <Typography variant="h4">Loading...</Typography>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            
            <div className={classes.row}>
                <div className={classes.camera}>
                    <Camera 
                        idents={(d) => handleDetections(d)}
                        modelLoaded={() => setWaiting(false)}
                        isRunning={run}
                    />
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => { !run && setWaiting(true); setRun(!run); }}
                    >
                        { waiting ? <CircularProgress size={24} /> : run ? 'STOP' : 'START' }
                    </Button>
                </div>
                <ContentCard
                    title="Participants"
                    subtitle={ParticipantForm()}
                    cls={classes.participants}
                >
                    {
                        participants.map(p => (
                            <div className={classes.participant} key={`p-${p.id}`}>
                                <Typography 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }} 
                                    variant="h6"
                                >
                                    <PersonIcon /> &nbsp; {p.User.name} {p.present ? <CheckIcon /> : <CloseIcon /> }
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => deleteParticipant(p.id)}
                                >
                                    <CloseIcon />
                                </Button>
                            </div>
                        ))
                    }
                </ContentCard>   
            </div>

            <div className={classes.row}>
                <EventForm event={event} />
                <ContentCard
                    title="Detections"
                    cls={classes.identifications}
                >
                    {
                        Object.keys(detections).map(d => {
                            const { label, count, avg_score } = detections[d]
                            if (label === 'Unknown')
                                return
                            return (
                                <div className={classes.identification} key={`d-${d}`}>
                                    {label} | {(100 - avg_score * 100).toFixed(0)}% | {count}
                                </div>
                            )
                        })
                    }
                </ContentCard>
            </div>
            
        </div>
    )
}

export default Event