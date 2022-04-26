import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Typography,
    TextField,
    FormControl,
    Button,
    Select,
    InputLabel,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

import PersonRemoveIcon from '@mui/icons-material/PersonRemove'

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

const UserForm = ({ user }) => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [role, setRole] = useState(null)

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setLoading(true)

        let res = null
        if (user)
            res =  await Axios.patch(`/users/${user.id}`, {
                name: name,
                email: email,
                role: role
            }).catch(err => console.log(err))

        if (!user)
            res = await Axios.post('/users', {
                name: name,
                email: email,
                role: role
            }).catch(err => console.log(err))
        
        setStatus(res?.data.status || res.status)
        setOpen('submit')
        setLoading(false)
    }

    const handleDelete = async () => {
        setLoading(true)

        const res = await Axios.delete(`/users/${user.id}`).catch(err => console.log(err))

        setStatus(res.status)
        setOpen('delete')
        setLoading(false)

        if (res.status === 200)
            setTimeout(() => navigate('/users'), 2000)
    }

    const handleClose = (_e, reason) => {
        if (reason === 'clickaway')
            return

        setOpen(false)
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }
    }, [user])

    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <FormControl className={classes.control}>
                    <Typography textAlign={'center'} variant="h4">{ user ? 'Edit' : 'Create' } User</Typography>
                    
                    <TextField 
                        type="text" 
                        color="info" 
                        variant="outlined" 
                        name="email" 
                        label="Email"
                        value={email || ''}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField 
                        type="text" 
                        color="info" 
                        variant="outlined" 
                        name="name" 
                        label="Name"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="input-role" color="info">Role</InputLabel>
                        <Select
                            labelId="input-role"
                            color="info"
                            value={role || ''}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="global_admin">Global Admin</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="instructor">Instructor</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                        </Select>
                    </FormControl>

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
                            user &&
                            <Button
                                color="error"
                                className={classes.delete}
                                variant="contained"
                                onClick={handleDelete}
                            >
                                <PersonRemoveIcon />
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
                    { status === 201 || status === 200 ?
                        <Alert severity="success" onClose={handleClose}>{ open === 'submit' ? 'User successfully updated' : 'User successfully deleted' }</Alert>
                        :
                        <Alert severity="error" onClose={handleClose}>Error updating user</Alert>
                    }
                </Snackbar>
            }
        </div>
    )
}

export default UserForm