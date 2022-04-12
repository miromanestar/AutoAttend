import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import {
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu
} from '@mui/material'
import logo from '../assets/favicon.svg'

import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const links = [
    {
        "name": "Home",
        "url": "/"
    },
    {
        "name": "Events",
        "url": "/events"
    },
    {
        "name": "Users",
        "url": "/users"
    }
]

const show_label = true

const useStyles = createUseStyles((theme) => ({
    root: {
        position: 'sticky',
        top: 20,
        zIndex: 999,
        transition: 'top 0.6s ease-in-out',
        marginBottom: '50px'
    },

    hide: {
        top: -100
    },

    blur: {
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
        borderRadius: '0.75rem',
        width: '90% !important',
        boxShadow: theme.boxShadow[0],
    },

    toolbar: {
        justifyContent: 'space-between !important',
    },

    menu: {
        borderRadius: '10px !important',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
        transform: 'translateY(15px) translateX(-3%) !important',

        '@supports (-moz-appearance: none)': {
            backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
        }
    },

    logo: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'white',
        padding: '10px',
        margin: '5px',
        transition: '.2s',
        borderRadius: '10px',

        '& img': {
            width: '50px',
        },

        '& div': {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginLeft: '10px',
        },

        [theme.breakpoints.down('sm')]: {
            padding: 0
        },

        '&:hover': {
            transform: 'scale(1.04)',
        },
    },

    button: {
        backgroundColor: theme.colors.background.primary + ' !important',
        borderRadius: '10px !important',
        padding: '10px 20px !important',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'white !important',
        transition: 'transform .2s, filter .2s, box-shadow .2s !important',

        '&:hover': {
            transform: 'translateY(-1px)',
            filter: 'brightness(0.95)',
            boxShadow: theme.boxShadow[0]
        },

        '&:active': {
            transform: 'translate3d(0, -10%, 0)'
        }
    }
}))

const ResponsiveNavbar = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [anchorElNav, setAnchorElNav] = React.useState(null)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = (route) => {
        navigate(route)
        setAnchorElNav(null)
    }

    return (
        <div className={classes.root}>
            <Container className={classes.blur} maxWidth="xl">
                <Toolbar className={classes.toolbar} disableGutters>
                    <Link
                        className={classes.logo}
                        style={{ display: { xs: 'none', md: 'flex' } }}
                        to="/"
                    >
                        <img src={logo} alt="" />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2 }}
                        >
                            {show_label && 'AutoAttend'}
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon style={{ color: 'white' }} />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }
                            }}
                            PaperProps={{ className: classes.menu }}
                            disableScrollLock={true}
                        >
                            {links.map((link) => (
                                <MenuItem key={link.name} className={classes.button} sx={{ margin: '10px 10px !important', justifyContent: 'center' }} onClick={() => handleCloseNavMenu(link.url)}>
                                    <Typography textAlign="center">{link.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
                        {links.map((link) => (
                            <Button
                                className={classes.button}
                                key={link.name}
                                onClick={() => handleCloseNavMenu(link.url)}
                            >
                                {link.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </div>
    );
};
export default ResponsiveNavbar;