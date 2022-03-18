import Express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = Express()
const port = process.env.PORT || 3000
const supabase = createClient('https://yhxdhsmoqwkhdbysyyin.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGRoc21vcXdraGRieXN5eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc2MzgzMjgsImV4cCI6MTk2MzIxNDMyOH0.jkPIj2B5s3MiHP3q2eb_j2eSXi-DPs4geiL0P3F6Aq0')

app.listen(port, () => console.log(`AutoAttend server started on port ${port}`))

const send = (res, payload) => {
    if (payload.error) {
        res.json(payload.error)
    } else {
        res.json(payload.data)
    }
}

//https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters
app.get('/', (req, res) => {
    console.log(`Received request from ${req.socket.remoteAddress}`)
    res.json({ message: 'AutoAttend API' })
})

app.get('/events', async (req, res) => {

    const payload = await supabase.from('Event').select()
    send(res, payload)
})

app.get('/events/:id', async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Event').select().eq('id', id)
    send(res, payload)
})