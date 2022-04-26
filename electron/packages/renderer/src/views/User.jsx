import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    Button,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Chip
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import Axios from '../tools/Axios'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import MemoryIcon from '@mui/icons-material/Memory'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import UserForm from '../components/UserForm'
import ContentCard from '../components/ContentCard'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(4)
    },

    imageForm: {
        display: 'flex',
        gap: theme.spacing(2),
        margin: theme.spacing(2),
        justifyContent: 'center'
    },

    imageItem: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: `${theme.colors.background.highlight} !important`,
        padding: theme.spacing(3),
        gap: theme.spacing(4),
        marginBottom: theme.spacing(2),
    },

    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        flex: 1
    },

    image: {
        borderRadius: theme.radius[2],
        height: '150px'
    },

    imageContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
    },
}))

const User = () => {
    const classes = useStyles()

    const { userId } = useParams()

    const [user, setUser] = useState(null)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(null)

    const [newUrl, setNewUrl] = useState(null)


    const getUser = async () => {
        const res = await Axios.get(`/users/${userId}`).catch(err => console.log(err))
        setUser(res.data[0])
    }

    const getUserImages = async () => {
        const res = await Axios.get(`/users/${userId}/images`).catch(err => console.log(err))
        setImages(res.data)
    }

    const addImage = async (e) => {
        e.preventDefault()

        const res = await Axios.post(`/users/${userId}/images`, {
            image_url: newUrl
        }).catch(err => console.log(err))

        getUserImages()
    }

    const createDescriptors = async () => {
        setLoading(true)
        const res = await Axios.post(`/users/${userId}/descriptors`).catch(err => console.log(err))
        await getUserImages()
        setLoading(false)
        setStatus(res.status)
        setOpen(true)
    }

    const removeImage = async (imageId) => {
        const res = await Axios.delete(`/users/${userId}/images/${imageId}`).catch(err => console.log(err))

        getUserImages()
    }

    const handleClose = (_e, reason) => {
        if (reason === 'clickaway')
            return

        setOpen(false)
    }

    useEffect(async () => {
        getUser()
        getUserImages()
    }, [])

    const ImageForm = () => (
        <form className={classes.imageForm} onSubmit={addImage}>
            <TextField
                color="info"
                variant="outlined"
                name="url"
                label="Image URL"
                value={newUrl || ''}
                onChange={e => setNewUrl(e.target.value)}
            />
            <Button
                type="submit"
                className={classes.submit}
                variant="contained"
                color="accent"
            >
                <AddPhotoAlternateIcon />
            </Button>

            <Button
                type="button"
                className={classes.process}
                variant="contained"
                color="warning"
                onClick={() => createDescriptors()}
            >
                { loading ? <CircularProgress /> : <MemoryIcon /> }
            </Button>
        </form>
    )

    return (
        <div className={classes.root}>
            <UserForm user={user} />
            <ContentCard
                title="Images"
                cls={classes.images}
                subtitle={ImageForm()}
            >
                {
                    images.map(image => (
                        <Paper className={classes.imageItem} elevation={4} key={image.id}>
                            <div className={classes.imageContent}>
                                <Typography variant="h6">
                                    { moment(image.created).format('MM/DD/YY, h:mm A') }
                                </Typography>

                                <Button
                                    sx={{ width: '100%' }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => removeImage(image.id)}
                                >
                                    <DeleteOutlineIcon />
                                </Button>
                                <Chip
                                    className={classes.chip}
                                    variant="outlined"
                                    icon={image.hasDescriptor ? <CheckIcon /> : <CloseIcon />}
                                    color={image.hasDescriptor ? 'success' : 'warning'}
                                    label={image.hasDescriptor ? 'Processed' : 'Unprocessed'}
                                />
                            </div>
                            <div className={classes.imageContainer}>
                                <img className={classes.image} src={image.url} alt={image.image_url} />
                            </div>
                        </Paper>
                    ))
                }
            </ContentCard>

            {open && 
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                >
                    { status === 200 ?
                        <Alert severity="success" onClose={handleClose}>Descriptors updated successfully</Alert>
                        :
                        <Alert severity="error" onClose={handleClose}>Error creating descriptors</Alert>
                    }
                </Snackbar>
            }

        </div>
    )
}

export default User