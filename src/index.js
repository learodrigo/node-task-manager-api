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

// GET - All tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// GET - All users
app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// GET - task by ID
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

// GET - user by ID
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

// POST - Tasks endpoint
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

// POST - Users endpoint
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

// PATCH - Updates task
app.patch('/tasks/:id', async (req, res) => {
    const updateObj = req.body
    const id = req.params.id
    const optionsObj = {
        new: true,
        runValidators: true
    }

    const allowedUpdates = ['description', 'date', 'completed']
    const updates = Object.keys(updateObj)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Unable to update UserID: ${id}. Check your request body: ${JSON.stringify(updateObj)}`
        })
    }

    try {
        const task = await TaskModel.findByIdAndUpdate(id, updateObj, optionsObj)

        if (!task) {
            return res.status(404).send({
                message: `UserID: '${_id}' couldn't be found`
            })
        }

        res.send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// PATCH - Updates user
app.patch('/users/:id', async (req, res) => {
    const updateObj = req.body
    const id = req.params.id
    const optionsObj = {
        new: true,
        runValidators: true
    }

    const allowedUpdates = ['name', 'surname', 'email', 'password', 'age']
    const updates = Object.keys(updateObj)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Unable to update UserID: ${id}. Check your request body: ${JSON.stringify(updateObj)}`
        })
    }

    try {
        const user = await UserModel.findByIdAndUpdate(id, updateObj, optionsObj)

        if (!user) {
            return res.status(404).send({
                message: `UserID: '${_id}' couldn't be found`
            })
        }

        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// DELETE - Task
app.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await TaskModel.findByIdAndDelete(_id)

        if (!user) {
            return res.status(404).send({
                message: `TaskID: '${_id}' couldn't be found`
            })
        }

        res.send(user)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// DELETE - User
app.delete('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await UserModel.findByIdAndDelete(_id)

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
