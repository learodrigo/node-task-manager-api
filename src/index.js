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
app.post('/tasks', async (req, res) => {
    const task = new TaskModel(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// List all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// Reads specific task by ID
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await TaskModel.findById(_id)

        if (!task) {
            return res.status(404).send({
                message: `TaskID: '${_id}' couldn't be found`
            })
        }

        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Users post endpoint
app.post('/users', async (req, res) => {
    const user = new UserModel(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// List all users
app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Reads specific user by ID
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await UserModel.findById(_id)

        if (!user) {
            return res.status(404).send({
                message: `UserID: '${_id}' couldn't be found`
            })
        }

        res.send(user)
    }
    catch (error) {
        res.status(500).send(error)
    }
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
