const send = (res, payload) => {

    if (payload.error)
        return res.json(payload.error)

    if (payload.data && payload.data.length === 0)
        return res.sendStatus(404)
    else if (payload.data)
        return res.json(payload.data)

    return res.json({ message: payload })
}

export default send