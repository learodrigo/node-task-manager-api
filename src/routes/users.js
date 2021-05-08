const express = require('express')

const multer = require('multer')
const auth = require('../middleware/auth')

const UserModel = require('../models/user')
const usersRouter = express.Router()

/**
 * @async GET - Returns a collection of users' documents
 * @returns {Object[] | null} - Array of user's documents
 */
usersRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
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
usersRouter.post('/users', async (req, res) => {
    try {
        const user = new UserModel(req.body)
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
 * @async POST - Log out
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {string} - Returns a message
 */
usersRouter.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()

        res.send()
    }
    catch (e) {
        res.status(500).send({ error: 'Unable to logout' })
    }
})

/**
 * @async POST - Log out
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {string} - Returns a message
 */
usersRouter.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    }
    catch (e) {
        res.status(500).send({ error: 'Unable to logout' })
    }
})

/**
 * POST - Uploads user profile image with form-data
 * @returns {void}
 */
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        const regex = /\.(gif|jpg|jpeg|png)$/

        if (!file.originalname.match(regex)) {
            return cb(new Error('Upload image file only'))
        }

        cb(undefined, true)
    }
})

usersRouter.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

/**
 * @async PATCH - Updates current user
 * @param {string} email - Email address field
 * @param {string} name - Name field
 * @param {string} password - Password field
 * @param {number?} age - Age field, it should be positive and has default 0
 * @param {surname?} surname - User's surname
 * @returns {Object[] | null} Updated object
 */
usersRouter.patch('/users/me', auth, async({ body, user }, res) => {
    const updates = Object.keys(body)
    const allowedUpdates = ['age', 'email', 'name', 'password', 'surname']

    const isValidOperation = updates.every(ele => allowedUpdates.includes(ele))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Unable to update user. Check your request body: ${JSON.stringify(body)}`
        })
    }

    try {
        updates.forEach(update => user[update] = body[update])

        await user.save()

        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

/**
 * @async DELETE - Deletes a specific user
 * @returns {Object[] | null} Deleted object
 */
usersRouter.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        res.send(req.user)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = usersRouter
