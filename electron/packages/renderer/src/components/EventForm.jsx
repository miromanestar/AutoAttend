import React, { useState, useEffect, useMemo } from 'react'
import {
    Typography,
    Autocomplete,
    CircularProgress,
    TextField,
    FormControl,
    Button
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createUseStyles } from 'react-jss'

import Axios from '../tools/Axios'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center'
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
    
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)

    const [owner, setOwner] = useState(null)
    const [date, setDate] = useState(null)

    useEffect(async () => {

        let isMounted = true

        if (!loading)
            return
    
        (async () => {
            const qurl = `/users`
            const response = await Axios.get(qurl).catch(err => {
                console.log(err)
                isMounted && setOptions([])
            })

            if (!isMounted)
                return
    
            if ( !(response.data instanceof Array) )
                setOptions([])
            
            setOptions(response.data || [])
            setLoading(false)
        })()

        return () => isMounted = false
    }, [])

    const UsersField = () => (
        <Autocomplete
            sx={{ width: 300 }}
            loading={loading}
            options={options}
            getOptionLabel={(option) => option.name}
            onChange={(_e, val) => setOwner(val)}
            value={owner}
            selectOnFocus={true}
            autoSelect={true}
            autoHighlight={true}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Owner"
                    color="info"
                    name="owner"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )

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
            <form className={classes.form}>
                <FormControl className={classes.control}>
                    <Typography variant="h5">Create/Edit Event</Typography>
                    
                    <div className={classes.group}>
                        <TextField type="text" color="info" variant="outlined" name="name" label="Event Name" />
                        <DatePicker />
                    </div>

                    <div className={classes.group}>
                        <UsersField />
                        <TextField multiline color="info" variant="outlined" name="description" label="Description" />
                    </div>

                    <Button type="submit" color="info" variant="contained">Submit</Button>
                </FormControl>
            </form>
        </div>
    )
}

export default EventForm