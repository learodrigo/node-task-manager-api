// Modules
const express = require('express')
require('dotenv').config()
require('./db/mongoose')

// Models
const UserModel = require('./models/user')
const TaskModel = require('./models/task')

// Express app
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Users post endpoint
app.post('/users', (req, res) => {
    const user = new UserModel(req.body)

    user.save()
        .then(() => res.status(201).send(user))
        .catch(e => {
            res.status(400).send({
                error: e.message,
                fullMessage: e
            })
        })
})

// Tasks post endpoint
app.post('/tasks', (req, res) => {
    const task = new TaskModel(req.body)

    task.save()
        .then(() => res.status(201).send(task))
        .catch(e => {
            res.status(400).send({
                error: e.message,
                fullMessage: e
            })
        })
})

// Page not found route
app.get('*', (req, res) => {
    res.send({
        message: `Looks like you're looking for a page that doens't exist :(`,
        title: 'Page not found'
    })
})

// Run app
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
