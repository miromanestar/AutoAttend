import React from 'react'
import { createUseStyles } from 'react-jss'

import { displayDate } from "../tools/Date"
import SearchableCard from '../components/SearchableCard'
import EventForm from '../components/EventForm'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(4),
        flexWrap: 'wrap'
    },

    form: {
        width: '100%',
    }
}))

const Home = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.form}>
                <EventForm />
            </div>
            <SearchableCard
                title="Events"
                url="/events"
                mapping={{
                    title: 'name',
                    subtitle: 'host',
                    description: 'description',
                    chip: 'status',
                    date: 'scheduled',
                    meta: (d) => `Created: ${ displayDate(d.created) }, Modified: ${ displayDate(d.modified) }`,
                }}
            />

            <SearchableCard
                title="Users"
                url="/users"
                mapping={{
                    title: 'name',
                    subtitle: 'email',
                    description: '',
                    chip: 'role',
                    date: 'registered',
                    meta: (_d) => '',
                }}
            />
        </div>
    )
}

export default Home