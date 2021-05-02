const express = require('express')
const UserModel = require('../models/user')

const usersRouter = express.Router()

/**
 * GET - Returns a collection of users' documents
 * @returns {Object[] | null} - Array of user's documents
 */
usersRouter.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

/**
 * GET - Returns a specific user document by a given id
 * @param {string} id - User id
 * @returns {Object[] | null} - A unique document found or null
 */
usersRouter.get('/users/:id', async (req, res) => {
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

/**
 * POST - Add user endpoint
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object[] | null} Inserted object
 */
usersRouter.post('/users', async (req, res) => {
    const user = new UserModel(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * PATCH - Updates user
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object[] | null} Updated object
 */
usersRouter.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    const updateObj = req.body

    const updates = Object.keys(updateObj)
    const allowedUpdates = ['age', 'email', 'name', 'password', 'surname']

    const isValidOperation = updates.every(ele => allowedUpdates.includes(ele))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Unable to update UserID: ${_id}. Check your request body: ${JSON.stringify(updateObj)}`
        })
    }

    try {
        const user = await UserModel.findById(_id)

        updates.forEach(update => user[update] = updateObj[update])

        await user.save()

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

/**
 * DELETE - Deletes a specific user
 * @param {string} id - Id field
 * @returns {Object[] | null} Deleted object
 */
usersRouter.delete('/users/:id', async (req, res) => {
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

module.exports = usersRouter
