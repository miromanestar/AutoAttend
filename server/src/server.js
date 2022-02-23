import Express from 'express'

const app = Express()
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`AutoAttend server started on port ${port}`))

//https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters
app.get('/', (req, res) => {
    console.log(`Received request from ${req.socket.remoteAddress}`)
    res.json({ message: 'AutoAttend API' })
})

app.get('/events', (req, res) => { 
    res.json({ message: 'AutoAttend API' })
})

app.get('/events/:id', (req, res) => {
    const id = req.params.id
    res.json({ message: `Event ${3}` })
})