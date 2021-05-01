const mongoose = require('mongoose')

const TaskModel = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = TaskModel
