const express = require('express')

const TaskModel = require('../models/task')

const tasksRouter = express.Router()

/**
 * GET - Returns a collection of tasks' documents
 * @returns {Object | null} - Array of tasks's documents
 */
tasksRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * GET - Returns a specific task document by a given id
 * @param {string} id - User id
 * @returns {Object | null} - A unique document or null
 */
tasksRouter.get('/tasks/:id', async (req, res) => {
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

/**
 * POST - Add task endpoint
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object | null} Inserted object
 */
tasksRouter.post('/tasks', async (req, res) => {
    const task = new TaskModel(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * PATCH - Updates task
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object | null} Updated object
 */
tasksRouter.patch('/tasks/:id', async (req, res) => {
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

/**
 * DELETE - Deletes a specific task
 * @param {string} id - Id field
 * @returns {Object | null} Deleted object
 */
tasksRouter.delete('/tasks/:id', async (req, res) => {
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

module.exports = tasksRouter
