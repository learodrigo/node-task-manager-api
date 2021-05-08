const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false
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
}, {
    timestamps: true
})

const TaskModel = mongoose.model('TaskModel', userSchema)

module.exports = TaskModel
