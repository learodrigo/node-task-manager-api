const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserModel'
    }
})

const TaskModel = mongoose.model('TaskModel', userSchema)

module.exports = TaskModel
