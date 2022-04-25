import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    Button,
    TextField,
    Typography,
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

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
        margin: theme.spacing(2)
    },

    images: {

    }
}))

const User = () => {
    const classes = useStyles()

    const { userId } = useParams()

    const [user, setUser] = useState(null)
    const [images, setImages] = useState([])

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
                Add
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
                        <div key={image.id}>
                            <img src={image.url} alt={image.image_url} />
                        </div>
                    ))
                }
            </ContentCard>
        </div>
    )
}

export default User