const request = require('supertest')

const app = require('../src/app')
const TaskModel = require('../src/models/task')

const {
    taskOne,
    taskTwo,
    taskThree,
    userOne,
    userTwo,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'This is a test task'
        })
        .expect(201)

    const task = await TaskModel.findById(res.body._id)

    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should request all tasks for user one', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(res.body.length).toBe(2)
})

test('Should not delete other users tasks', async () => {
    const res = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Barer ${userTwo.tokens[0].token}`)
        .send()
        .expect(401)

    const task = await TaskModel.findById(taskOne._id)
    expect(task).not.toBeNull()
})
