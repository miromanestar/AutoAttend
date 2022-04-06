import 'dotenv/config'
import Express from 'express'
import { createDescriptors } from './services/recognition.js'
import cors from 'cors'

import eventsRouter from './routes/events.js'
import usersRouter from './routes/users.js'
import descriptorsRouter from './routes/descriptors.js'
import identifyRouter from './routes/identify.js'

import milvus from './services/milvus.js'

const app = Express()
const port = process.env.PORT || 3000


const auth = (req, res, next) => {
    if (req.headers.authorization === process.env.AUTH_KEY) {
        next()
    } else {
        res.json({ error: 'Unauthorized' })
    }
}

app.use(cors())
app.use(Express.json())
app.use(auth)

//Set the routes
app.use('/events/', eventsRouter)
app.use('/users/', usersRouter)
app.use('/descriptors/', descriptorsRouter)
app.use('/identify/', identifyRouter)

app.listen(port, () => console.log(`AutoAttend server started on port ${port}`))

app.get('/', async (req, res) => {
    res.json({ message: 'AutoAttend API' })
})

//TEMPORARY THING
app.get('/test', async (req, res) => {
    const { data, error } = await createDescriptors()
    res.json({ message: 'Descriptors created', data, error })
})

app.get('/test2', async(req, res) => {
    const r = await milvus.collectionManager.getCollectionStatistics({ collection_name: 'faces' })
    res.json({ message: r })
})