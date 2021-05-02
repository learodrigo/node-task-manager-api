const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

const validator = require('validator')

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
    }
})

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

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
