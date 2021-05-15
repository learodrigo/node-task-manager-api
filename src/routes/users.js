const express = require('express')

const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const UserModel = require('../models/user')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

const usersRouter = express.Router()

/**
 * @async GET - Returns a collection of users' documents
 * @returns {Object[] | null} - Array of user's documents
 */
usersRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

/**
 * GET - Gets user avatar
 * @returns {void}
 */
usersRouter.get('/users/:id/avatar', async ({ params }, res) => {
    try {
        const user = await UserModel.findById(params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')

        res.send(user.avatar)
    }
    catch (error) {
        res.status(404).send()
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
usersRouter.post('/users', async (req, res) => {
    try {
        const user = new UserModel(req.body)

        await user.save()

        await sendWelcomeEmail(user)

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send({ error: error.message })
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

usersRouter.post('/users/me/avatar', auth, upload.single('avatar'), async ({ file, user }, res) => {
    const buffer = await sharp(file.buffer)
        .resize({ height: 250, width: 250 })
        .png()
        .toBuffer()

        user.avatar = buffer

    await user.save()

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
usersRouter.delete('/users/me', auth, async ({ user }, res) => {
    try {
        await user.remove()

        await sendCancelationEmail(user)

        res.send(user)
    }
    catch (error) {
        res.status(401).send(error)
    }
})

/**
 * DELETE - Deletes user profile image
 * @returns {void}
 */
usersRouter.delete('/users/me/avatar', auth, async ({ user }, res) => {
    user.avatar = undefined

    await user.save()

    res.send()
})

module.exports = usersRouter
