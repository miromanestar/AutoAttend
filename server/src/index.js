import Express from 'express'

const app = Express()
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`AutoAttend server started on port ${port}`))

app.get('/', (req, res) => { 
    res.json({ message: 'AutoAttend API' })
})