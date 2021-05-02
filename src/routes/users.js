const express = require('express')

const UserModel = require('../models/user')

const usersRouter = express.Router()

/**
 * @async GET - Returns a collection of users' documents
 * @returns {Object[] | null} - Array of user's documents
 */
usersRouter.get('/users', async (_, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

/**
 * @async GET - Returns a specific user document by a given id
 * @param {string} id - User id
 * @returns {Object[] | null} - A unique document found or null
 */
usersRouter.get('/users/:id', async ({ params }, res) => {
    try {
        const _id = params.id
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
 * @async POST - Add user endpoint
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object[] | null} Inserted object
 */
usersRouter.post('/users', async ({ body }, res) => {
    try {
        const user = new UserModel(body)
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * @async POST - Login endpoint
 * @param {string} email - Email address field
 * @returns {Object[] | null} Inserted object
 */
usersRouter.post('/users/login', async ({ body }, res) => {
    try {
        const { email, password } = body
        const user = await UserModel.findByCredentials(email, password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send('Unable to log in.')
    }
})

/**
 * @async PATCH - Updates user
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object[] | null} Updated object
 */
usersRouter.patch('/users/:id', async({ body, params }, res) => {
    const _id = params.id
    const updateObj = body

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
 * @async DELETE - Deletes a specific user
 * @param {string} id - Id field
 * @returns {Object[] | null} Deleted object
 */
usersRouter.delete('/users/:id', async ({ params }, res) => {
    try {
        const _id = params.id
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
