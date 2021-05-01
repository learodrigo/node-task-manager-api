const mongoose = require('mongoose')
const validator = require('validator')

const UserModel = mongoose.model('User', {
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

module.exports = UserModel
