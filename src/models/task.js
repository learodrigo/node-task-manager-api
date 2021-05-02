const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date()
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const TaskModel = mongoose.model('Task', userSchema)

module.exports = TaskModel
