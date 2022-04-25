import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
    Typography,
    Button,
    CircularProgress,
    Chip,
    Divider
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'
import moment from 'moment'

import PersonIcon from '@mui/icons-material/Person'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import LockIcon from '@mui/icons-material/Lock'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import HourglassFullIcon from '@mui/icons-material/HourglassFull'

import Camera from '../components/Camera'
import ContentCard from '../components/ContentCard'
import SearchInput from '../components/SearchInput'
import EventForm from '../components/EventForm'

const useStyles = createUseStyles(theme => ({
    root: {
        maxWidth: '1400px',
        margin: '0 auto',
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
        borderRadius: theme.radius[2],
        flex: 9,
    },

    participants: {
        flex: 10,
        maxHeight: 'initial',
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
    },

    identification: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(4),
        margin: theme.spacing(2, 0),

        '& h6': {
            width: '30%'
        }
    },

    identChips: {
        display: 'flex',
        gap: theme.spacing(2)
    },

    identButtons: {
        display: 'flex',
        gap: theme.spacing(2),
    },

    dashboard: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    controls: {
        display: 'flex',
        gap: theme.spacing(2)
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

    const [timer, setTimer] = useState('00:00:00')
    
    const presentRef = useRef({})

    const addParticipant = async (e) => {
        e.preventDefault()

        for (const p of participants)
            if (p.user_id === newParticipant.id)
                return

        await Axios.post(`/events/${eventId}/participants`, {
            user_id: newParticipant.id
        }).catch(err => console.log(err))

        getParticipants()
    }

    const getEvent = async () => {
        const res = await Axios.get(`/events/${eventId}`).catch(err => console.log(err))
        setEvent(res.data[0])
    }

    const toggleEventStatus = async (reset) => {
        let tempEv = { }

        if (reset) {
            tempEv.status = 'scheduled'
            tempEv.started = null
            tempEv.ended = null
        } else if (event.status === 'started') {
            tempEv.status = 'ended'
            tempEv.ended = new Date().toISOString()
        } else if (event.status === 'scheduled') {
            tempEv.status = 'started'
            tempEv.started = new Date().toISOString()
            tempEv.ended = null
        } else if (event.status === 'ended') {
            tempEv.status = 'started'
            tempEv.ended = null
        }

        await Axios.patch(`/events/${eventId}`, tempEv)
            .catch(err => console.log(err))

        getEvent()
    }

    const handleEvent = async () => {
        !run && setWaiting(true)
        setRun(!run)
        toggleEventStatus()
    }
    
    const getParticipants = async () => {
        const res = await Axios.get(`/events/${eventId}/participants`).catch(err => console.log(err))

        res.data?.data.forEach(p => {
            presentRef.current[p.user_id] = {
                present: p.present,
                locked: p.locked,
            }
        })

        const sorted = res.data?.data.sort((a, b) => {
            const a_name = a.User.name
            const b_name = b.User.name

            return a_name < b_name ? -1 : a_name > b_name ? 1 : 0
        })

        setParticipants(sorted || [])
    }

    const changePresentStatus = async (user_id, status, locked) => {
        await Axios.patch(`/events/${eventId}/participants/${user_id}`, {
            present: status,
            locked: locked
        }).catch(err => console.log(err))

        presentRef.current[user_id] = {
            present: status,
            locked: locked
        }
        getParticipants()
    }

    const deleteParticipant = async (id) => {
        await Axios.delete(`/events/${eventId}/participants/${id}`).catch(err => console.log(err))
        getParticipants()
    }

    const removeLock = async (user_id) => {
        await Axios.patch(`/events/${eventId}/participants/${user_id}`, {
            locked: false
        }).catch(err => console.log(err))

        getParticipants()
    }

    const handleDetections = (dets) => {
        const newDets = detections

        dets.forEach(d => {
            const count = newDets[d.user_id]?.count + 1 || 1
            const total_score = newDets[d.user_id]?.total_score + d.score || d.score
            const avg_score = total_score / count
            newDets[d.user_id] = { 
                ...d, 
                count: count,
                total_score: total_score,
                avg_score: avg_score,
                last_seen: Date.now()
            }

            if (count > 5 && avg_score < 0.3 && !presentRef?.current[d.user_id]?.locked)
                changePresentStatus(d.user_id, true, false)
        })

        setDetections({...newDets})
    }

    useEffect(async () => {
        Promise.all([getEvent(), getParticipants()]).then(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (event?.status === 'started')
            setRun(true)
        if (event?.status === 'scheduled' || event === 'ended')
            setRun(false)

        if (!event?.started)
            return
        
        let interval = null
        if (event?.status === 'started')
            interval = setInterval(() => {
                const diff = moment.duration(moment(new Date()).diff(moment(event.started)))
                const formatted = moment.utc(diff.asMilliseconds()).format('HH:mm:ss')

                setTimer(formatted)
            }, 1000)

        return () => clearInterval(interval)
    }, [event])

    const ParticipantForm = () => (
        <form className={classes.form} onSubmit={addParticipant}>
            <SearchInput
                url="/users"
                label="Users"
                name="user"
                getOptionLabel={(option) => option.name}
                onChange={(val) => setNewParticipant(val)}
            />
            <Button type="submit" variant="contained" color="accent">
                <PersonAddAlt1Icon />
            </Button>
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
                    
                    <div className={classes.dashboard}>
                        <div className={classes.controls}>
                            <Button
                                variant="contained"
                                color="accent"
                                onClick={handleEvent}
                            >
                                { waiting ? <CircularProgress size={24} /> : run ? 'STOP' : event?.status === 'scheduled' ? 'START' : 'RESUME' }
                            </Button>
                            { event.status === 'ended' &&
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => toggleEventStatus(true)}
                                >
                                    <RestartAltIcon />
                                </Button>
                            }
                        </div>
                        <Typography variant="h4"><HourglassFullIcon />{timer}</Typography>
                    </div>
                </div>
                <ContentCard
                    title="Participants"
                    subtitle={ParticipantForm()}
                    cls={classes.participants}
                >
                    <Typography variant="h6" textAlign="right">
                        {(() => {
                            const numPresent = participants.reduce((a, b) => b.present ? ++a : a, 0)
                            return `${numPresent}/${participants.length} present (${Math.round(numPresent / participants.length * 100)}%)`
                        })()}
                    </Typography>
                    {
                        participants.map(p => (
                            <div className={classes.participant} key={`p-${p.user_id}`}>
                                <Typography 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }} 
                                    variant="h6"
                                >
                                    <PersonIcon /> &nbsp; {p.User.name}
                                </Typography>

                                <div className={classes.identButtons}>
                                    { p.locked && 
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => removeLock(p.user_id)}
                                        >
                                            <LockIcon /> 
                                        </Button>
                                    }
                                    <Button
                                        variant="contained"
                                        color={p.present ? 'success' : 'warning'}
                                        onClick={() => changePresentStatus(p.user_id, !p.present, true)}
                                    >
                                        { p.present ? <CheckIcon /> : <CloseIcon /> }
                                    </Button>

                                    <Button 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => deleteParticipant(p.user_id)}
                                    >
                                        <PersonRemoveIcon />
                                    </Button>
                                </div>
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
                                <div key={`d-${d}`}>
                                    <div className={classes.identification}>
                                        <Typography variant="h6">
                                            {label} 
                                        </Typography>

                                        <div className={classes.identChips}>
                                            <Chip 
                                                variant="outlined" 
                                                icon={<PersonSearchIcon />} 
                                                label={count}
                                            />

                                            <Chip 
                                                variant="outlined" 
                                                icon={<GpsFixedIcon />} 
                                                label={(100 - avg_score * 100).toFixed(0) + '%'}
                                            />
                                        </div>

                                        <Typography variant="caption">
                                            {moment(detections[d].last_seen).startOf('second').fromNow()}
                                        </Typography>
                                    </div>
                                    <Divider />
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