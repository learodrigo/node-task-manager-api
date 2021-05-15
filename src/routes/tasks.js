const express = require('express')

const TaskModel = require('../models/task')
const auth = require('../middleware/auth')

const tasksRouter = express.Router()

/**
 * GET - Returns a collection of tasks' documents for current user
 * @returns {Object | null} - Array of tasks's documents
 */
tasksRouter.get('/tasks', auth, async ({ query, user }, res) => {
    const match = {}
    const sort = {}

    if (query.completed) {
        match.completed = query.completed === 'true'
    }

    if (query.sortBy) {
        const [key, value] = query.sortBy.split(':')
        sort[key] = value === 'desc' ? -1 : 1
    }

    try {
        await user.populate({
            match,
            options: {
                limit: parseInt(query.limit),
                skip: parseInt(query.skip),
                sort
            },
            path: 'tasks'
        }).execPopulate()

        res.send(user.tasks)
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
tasksRouter.get('/tasks/:id', auth, async ({ params, user }, res) => {
    try {
        const _id = params.id

        const task = await TaskModel.findOne({ _id, user: user._id })

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
 * @param {string} description - Task description
 * @returns {Object | null} Inserted document
 */
tasksRouter.post('/tasks', auth, async ({ body, user }, res) => {
    try {
        const task = new TaskModel({
            ...body,
            user: user._id
        })

        await task.save()

        res.status(201).send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * PATCH - Updates task
 * @param {string} description - Task description field
 * @param {boolean} completed - Task completed field
 * @returns {Object | null} Updated object
 */
tasksRouter.patch('/tasks/:id', auth, async ({ body, params, user }, res) => {
    const _id = params.id

    const updates = Object.keys(body)
    const allowedUpdates = ['description', 'date', 'completed']

    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Unable to update UserID: ${_id}. Check your request body: ${JSON.stringify(body)}`
        })
    }

    try {
        const task = await TaskModel.findOne({ _id, user: user._id })

        if (!task) {
            return res.status(404).send({
                message: `TaskID: '${_id}' doesn't exist`
            })
        }

        updates.forEach(update => task[update] = body[update])

        await task.save()

        res.send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * DELETE - Deletes a specific task for current user
 * @param {string} id - Task id field
 * @returns {Object | null} Deleted object
 */
tasksRouter.delete('/tasks/:id', auth, async ({ params, user }, res) => {
    try {
        const _id = params.id

        const task = await TaskModel.findOneAndDelete({ _id, user: user._id })

        if (!task) {
            return res.status(404).send({
                message: `TaskID: '${_id}' couldn't be found`
            })
        }

        res.send(task)
    }
    catch (error) {
        res.status(401).send(error)
    }
})

module.exports = tasksRouter
