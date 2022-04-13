import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Typography,
    TextField,
    FormControl,
    Button
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
    }
}))

const EventForm = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [name, setName] = useState(null)
    const [desc, setDesc] = useState(null)
    const [owner, setOwner] = useState(null)
    const [date, setDate] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await Axios.post('/events', {
            name: name,
            description: desc,
            owner_id: owner.id,
            owner_name: owner.name,
            scheduled: date
        }).catch(err => console.log(err))
        
        if (res.data.status === 201)
            navigate(`/events/${res.data.data[0].id}`)
    }

    const DatePicker = () => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} color="info" />}
                label="Scheduled Time"
                value={date}
                onChange={(val) => setDate(val)}
                minDateTime={new Date()}
            />
        </LocalizationProvider>
    )

    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <FormControl className={classes.control}>
                    <Typography textAlign={'center'} variant="h4">Create Event</Typography>
                    
                    <TextField 
                        type="text" 
                        color="info" 
                        variant="outlined" 
                        name="name" 
                        label="Event Name"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className={classes.group}>
                        <SearchInput
                            url="/users"
                            label="Owner"
                            name="owner"
                            getOptionLabel={(option) => option.name}
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
                        onChange={(e) => setDesc(e.target.value)}
                    />

                    <Button sx={{ marginTop: '10px'}} type="submit" color="info" variant="contained">Submit</Button>
                </FormControl>
            </form>
        </div>
    )
}

export default EventForm