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
