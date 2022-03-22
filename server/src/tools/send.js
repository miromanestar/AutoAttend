const send = (res, payload) => {
    if (payload.error)
        return res.json(payload.error)

    if (payload.data.length === 0)
        return res.sendStatus(404)

    return res.json(payload.data)
}

export default send