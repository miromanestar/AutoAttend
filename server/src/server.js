import 'dotenv/config'
import Express from 'express'
import { createDescriptors } from './services/recognition.js'

import eventsRouter from './routes/events.js'
import usersRouter from './routes/users.js'
import descriptorsRouter from './routes/descriptors.js'

const app = Express()
const port = process.env.PORT || 3000


const auth = (req, res, next) => {
    if (req.headers.authorization === process.env.AUTH_KEY) {
        next()
    } else {
        res.json({ error: 'Unauthorized' })
    }
}

app.use(auth)

//Set the routes
app.use('/events/', eventsRouter)
app.use('/users/', usersRouter)
app.use('/descriptors/', descriptorsRouter)

app.listen(port, () => console.log(`AutoAttend server started on port ${port}`))

app.get('/', async (req, res) => {
    res.json({ message: 'AutoAttend API' })
})

//TEMPORARY THING
app.get('/test', async (req, res) => {
    const { data, error } = await createDescriptors()
    res.json({ message: 'Descriptors created', data, error })
})
