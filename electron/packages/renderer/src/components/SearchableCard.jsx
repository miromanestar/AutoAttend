import React, { useState, useEffect } from 'react'
import Axios from '../tools/Axios'
import {
    Paper,
    Chip,
    CircularProgress,
    IconButton,
    Card,
    CardHeader,
    CardContent,
    CardActionArea,
    CardActions,
    Collapse,
    TextField,
    Autocomplete,
    Skeleton,
    Typography
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { createUseStyles } from "react-jss"

import { displayDate } from "../tools/Date"


const useStyles = createUseStyles(theme => ({
    root: {
        width: '600px',
    },

    title: {
        textAlign: "center",
        padding: theme.spacing(1, 1),
        marginTop: theme.spacing(1),
        borderRadius: `${theme.radius[2]} !important`,
        position: 'relative',
        top: '-30px',
        backgroundColor: `${theme.colors.background.highlight} !important`,
    },

    paper: {
        padding: theme.spacing(1, 1),
        width: "100%",
    },

    inputField: {
        padding: theme.spacing(1, 2),
    },

    cardHeader: {
        display: "flex",
        flexDirection: "row"
    },

    cardTitle: {
        display: "flex",
        justifyContent: "space-between"
    },

    results: {
        padding: theme.spacing(1, 1),
        maxheight: "800px",
        overflowY: "auto",

        '&::-webkit-scrollbar': {
            width: '6px'
        },
        '&::-webkit-scrollbar-track': {
            background: theme.colors.background.primary
        },
        '&::-webkit-scrollbar-thumb': { 
            background: theme.colors.background.highlight
        },
        scrollbarWidth: 'thin',
    },

    result: {
        margin: theme.spacing(2, 1),
        background: `${theme.colors.background.highlight} !important`,
    },

    noResults: {
        textAlign: 'center',
        margin: theme.spacing(2, 1),
        padding: theme.spacing(1),
        background: theme.colors.background.highlight,
    },

    option: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    createdAt: {
        color: "white",
    },

    skeleton: {
        backgroundColor: theme.colors.background.secondary,
    },

    chip: {
        margin: theme.spacing(0, 0, 1, 0),
        textTransform: 'uppercase',
    }
}))

const SearchableCard = ({ title, url, mapping }) => {
    const classes = useStyles()
    
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState([])
    const [cards, setCards] = useState(null)
    const [expanded, setExpanded] = useState(false)

    const handleClickCard = (key) => {
        setExpanded(key !== expanded ? key : false)
    }

    const getData = async (url, callback) => {
        const response = await Axios.get(url).catch(err => {
            console.log(err)
            callback([])
        })

        if( !(response.data instanceof Array) )
            callback([])


        const mapped = response.data.map(d => {
            return {
                title: d[mapping.title],
                subtitle: d[mapping.subtitle],
                description: d[mapping.description],
                chip: d[mapping.chip],
                date: d[mapping.date],
                id: d[mapping.id] || d.id,
                meta: mapping.meta(d),
            }
        })

        callback(mapped)
    }

    useEffect(() => {
        setLoading(true)

        const qurl = `${url}?query=${ input.join('&query=') }`
        getData(qurl, data => {
            setCards(data)
            setLoading(false)
        })

    }, [input])

    const SearchCard = (card, index) => (
        <Card
            className={classes.result}
            key={index}
            elevation={9}
        >
            <div className={classes.cardHeader}>
                <CardActionArea
                    onClick={() => handleClickCard(`card-${index}`)}
                    disableRipple={true}
                >
                    <CardHeader
                        title={
                            <div className={classes.cardTitle}>
                                <div>
                                    {card.title}
                                </div>
                                <Chip label={card.chip} className={classes.chip} />
                            </div>
                        }
                        subheader={
                            <div className={classes.cardTitle}>
                                <div>
                                    { card.subtitle }
                                </div>
                                <div style={{display: "flex", alginItems: "center"}}>
                                    <span>{ displayDate(card.date) }&nbsp;</span>
                                    <AccessTimeIcon />
                                </div>
                            </div>
                        }
                    />
                </CardActionArea>
                <CardActions>
                    <IconButton
                        size="large"
                        href={`/#${ url }/${ card.id }`}
                    >
                        <OpenInNewIcon />
                    </IconButton>
                </CardActions>
            </div>
            <Collapse
                in={expanded === `card-${index}`}
                timeout="auto"
                unmountOnExit
            >
                <CardContent>
                    {card.description}
                    <br />
                    <Typography variant="subtitle2" className={classes.createdAt} mt={1}>
                        {card.meta}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )

    return (
        <div className={classes.root}>
            <Paper elevation={9} className={classes.paper}>
                <Paper className={classes.title} elevation={4}>
                    <Typography variant="h4">{ title }</Typography>
                </Paper>
                <Autocomplete
                    className={classes.inputField}
                    multiple
                    freeSolo
                    options={[]}
                    onChange={(_e, val) => {
                        setInput(val)
                    }}
                    renderInput={
                        (params) => <TextField
                            {...params}
                            label="Search"
                            color="info"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                )
                            }}
                        />
                    }
                />
                <div className={classes.results}>
                    { cards ? null :
                        [...Array(3)].map((_el, index) => 
                            <Card className={classes.result} elevation={9} key={`issue_${index}`}>
                                <Skeleton className={classes.skeleton} variant="rectangular" height={100} animation="wave" />
                            </Card>
                        )
                    }

                    { cards && cards.length === 0 ?
                        <Paper elevation={9} className={classes.noResults}>
                            <h3>No Results</h3>
                        </Paper>
                        
                        : null
                    }

                    { !cards ? null : cards.map((card, index) => SearchCard(card, index)) }
                </div>
            </Paper>
        </div>
    )
}

export default SearchableCard