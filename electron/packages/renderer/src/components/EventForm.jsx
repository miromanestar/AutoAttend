import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Typography,
    TextField,
    FormControl,
    Button,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { createUseStyles } from 'react-jss'

import Axios from '../tools/Axios'
import SearchInput from './SearchInput'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },

    control: {
        '& div': {
            margin: '3px 0',
        }
    },

    group: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),

        '& div': {
            flex: 1
        }
    },

    buttons: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
    },

    submit: {
        flex: 3
    },

    delete: {
        flex: 1
    }
}))

const EventForm = ({ event }) => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [name, setName] = useState(null)
    const [desc, setDesc] = useState(null)
    const [owner, setOwner] = useState(null)
    const [date, setDate] = useState(null)

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        let res = null
        if (event)
            res = await Axios.patch(`/events/${event.id}`, {
                name: name,
                description: desc,
                host: owner.name,
                owner: owner.id,
                scheduled: date
            }).catch(err => console.log(err))

        if (!event)
            res = await Axios.post('/events', {
                name: name,
                description: desc,
                owner_id: owner.id,
                owner_name: owner.name,
                scheduled: date
            }).catch(err => console.log(err))
        
        setLoading(false)
        setStatus(res.status)
        setOpen('submit')

        if (res.data.status === 201)
            navigate(`/events/${res.data.data[0].id}`)
    }

    const handleDelete = async () => {
        setLoading(true)

        const res = await Axios.delete(`/events/${event.id}`).catch(err => console.log(err))

        setLoading(false)
        setStatus(res.status)
        setOpen('delete')

        if (res.status === 200)
            setTimeout(() => navigate('/events'), 2000)
    }

    const handleClose = (_e, reason) => {
        if (reason === 'clickaway')
            return

        setOpen(false)
    }

    useEffect(() => {
        if (event) {
            setName(event.name)
            setDesc(event.description)
            setOwner(event.User)
            setDate(event.scheduled)
        }
    }, [])

    const DatePicker = () => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} error={false} color="info" />}
                label="Scheduled Time"
                value={date}
                onChange={(val) => setDate(val)}
                minDateTime={new Date()}
                clearable
            />
        </LocalizationProvider>
    )

    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <FormControl className={classes.control}>
                    <Typography textAlign={'center'} variant="h4">{ event ? 'Edit' : 'Create' } Event</Typography>
                    
                    <TextField 
                        type="text" 
                        color="info" 
                        variant="outlined" 
                        name="name" 
                        label="Event Name"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className={classes.group}>
                        <SearchInput
                            url="/users"
                            label="Owner"
                            name="owner"
                            getOptionLabel={(option) => option.name}
                            defaultValue={event?.User || ''}
                            onChange={(val) => setOwner(val)}
                        />
                        <DatePicker />
                    </div>

                    <TextField 
                        multiline 
                        color="info" 
                        variant="outlined" 
                        name="description" 
                        label="Description"
                        value={desc || ''}
                        onChange={(e) => setDesc(e.target.value)}
                    />

                    <div className={classes.buttons}>
                        <Button 
                            type="submit"
                            className={classes.submit}
                            color="info" 
                            variant="contained"
                        >
                            Submit
                            { loading === 'submit' && <CircularProgress size={20} /> }
                        </Button>
                        
                        {
                            event &&
                            <Button
                                color="error"
                                className={classes.delete}
                                variant="contained"
                                onClick={handleDelete}
                            >
                                Remove
                                { loading === 'delete' && <CircularProgress size={20} /> }
                            </Button>
                        }
                    </div>

                </FormControl>
            </form>

            {open && 
                <Snackbar
                    open={open ? true : false}
                    autoHideDuration={3000}
                    onClose={handleClose}
                >
                    { status === 200 ?
                        <Alert severity="success" onClose={handleClose}>{ open === 'submit' ? 'Event succsesfully updated' : 'Event successfully deleted' }</Alert>
                        :
                        <Alert severity="error" onClose={handleClose}>Error updating event</Alert>
                    }
                </Snackbar>
            }

        </div>
    )
}

export default EventForm