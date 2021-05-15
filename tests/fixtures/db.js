const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const UserModel = require('../../src/models/user')
const TaskModel = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Michael',
    email: 'michael@exaple.com',
    password: '56What!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN_SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'John',
    email: 'john@exaple.com',
    password: '007!!Who',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_TOKEN_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task one',
    completed: false,
    user: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task two',
    completed: true,
    user: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task three',
    completed: true,
    user: userTwo._id
}

const setupDatabase = async () => {
    await UserModel.deleteMany()
    await TaskModel.deleteMany()

    await new UserModel(userOne).save()
    await new UserModel(userTwo).save()

    await new TaskModel(taskOne).save()
    await new TaskModel(taskTwo).save()
    await new TaskModel(taskThree).save()
}

module.exports = {
    taskOne,
    taskTwo,
    taskThree,
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    setupDatabase
}
