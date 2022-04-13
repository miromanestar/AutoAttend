import React, { useState, useEffect } from 'react'
import {
    Autocomplete,
    CircularProgress,
    TextField,
} from '@mui/material'
import Axios from '../tools/Axios'


const SearchInput = ({ url, getOptionLabel, onChange, label, name }) => {

    const [value, setValue] = useState(null)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)

    const handleChange = (val) => {
        setValue(val)

        if (onChange)
            onChange(val)
    }

    useEffect(async () => {
        let isMounted = true

        if (!loading)
            return
        
        (async () => {
            const res = await Axios.get(url) .catch(err => {
                console.log(err)
                isMounted && setOptions([])
            })

            if (!isMounted)
                return

            if ( !(res.data instanceof Array) )
                setOptions([])

            setOptions(res.data || [])
            setLoading(false)

            return () => isMounted = false
        })()
    }, [])

    return (
        <Autocomplete
            sx={{ width: 300 }}
            loading={loading}
            options={options}
            getOptionLabel={(option) => getOptionLabel(option)}
            onChange={(_e, val) => handleChange(val)}
            value={value}
            selectOnFocus={true}
            autoSelect={true}
            autoHighlight={true}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    color="info"
                    name={name}
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
}

export default SearchInput