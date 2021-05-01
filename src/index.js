// Modules
const express = require('express')
require('dotenv').config()
require('./db/mongoose')

// Models
const TaskModel = require('./models/task')
const UserModel = require('./models/user')

// Express app
const app = express()
const PORT = process.env.PORT || 3000

// App config
app.use(express.json())

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

// List all tasks
app.get('/tasks', (req, res) => {
    TaskModel.find({})
        .then(tasks => res.send(tasks))
        .catch(e => {
            res.status(400).send({
                error: e.message,
                fullMessage: e
            })
        })
})

// Reads specific task by ID
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    TaskModel.findById(_id)
        .then(task => {
            if (!task) {
                return res.status(404).send({
                    message: `TaskID: '${_id}' couldn't be found`
                })
            }

            res.send(task)
        })
        .catch(e => {
            res.status(500).send({
                error: e.message,
                fullMessage: e
            })
        })
})

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

// List all users
app.get('/users', (req, res) => {
    UserModel.find({})
        .then(users => res.send(users))
        .catch(e => {
            res.status(400).send({
                error: e.message,
                fullMessage: e
            })
        })
})

// Reads specific user by ID
app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    UserModel.findById(_id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `UserID: '${_id}' couldn't be found`
                })
            }

            res.send(user)
        })
        .catch(e => {
            res.status(500).send({
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

// Run at PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
