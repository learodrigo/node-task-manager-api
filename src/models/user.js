const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const TaskModel = require('./task')

const userSchema = new mongoose.Schema({
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email format is not valid')
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minLength: 7,
        required: true,
        trim: true,
        validate(password) {
            if (!validator.isStrongPassword(password)) {
                throw new Error('Password is not strong')
            }
        }
    },
    surname: {
        type: String,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

/**
 * @async generateAuthToken - Looks and return for user given email-password pair
 * @returns {object | null} - Verified token | null
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_TOKEN_SECRET
    )

    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

/**
 * @async toJSON - Formats user object to be secutrly public
 * @returns {object} - Object user
 */
userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

/**
 * @async findByCredentials - Looks and return for user given email-password pair
 * @param {string} email - Email address field
 * @param {string} password - Password field
 * @returns {object | null} - User document or null
 */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email })

    if (!user) {
        throw new Error('Unable to log in.')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to log in.')
    }

    return user
}

/**
 * @async Previous to save - Hash the plain text password before savingemail-password pair
 * @param {callback} next - Callback function
 * @returns {void}
 */
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        try {
            user.password = await bcrypt.hash(user.password, 8)
        }
        catch (e) {
            console.log(e)
        }
    }

    next()
})

/**
 * @async Deletes user's tasks when removed
 * @returns {void}
 */
userSchema.pre('remove', async function(next) {
    const user = this

    await TaskModel.deleteMany({ user: user._id })

    next()
})

/**
 * Virtual reference to tasks model
 * @param {String} foreignField - Reference to foreign field
 * @param {String} localField - Reference to local field
 * @param {String} ref - Reference to model's name
 */
userSchema.virtual('tasks', {
    foreignField: 'user',
    localField: '_id',
    ref: 'TaskModel'
})

// Model creation
const UserModel = mongoose.model('UserModel', userSchema)

module.exports = UserModel
