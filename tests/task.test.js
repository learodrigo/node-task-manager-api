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
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Barer ${userTwo.tokens[0].token}`)
        .send()
        .expect(401)

    const task = await TaskModel.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not create task with invalid completed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'This must fail'
        })
        .expect(400)
})

test('Should not update task with invalid completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'This must fail'
        })
        .expect(400)
})

test('Should delete user task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete task if unauthenticated', async () => {
    const res = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)

    const task = await TaskModel.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not update other user tasks', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should fetch user task by id', async () => {
    const res = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(userOne._id.toString()).toBe(res.body.user)
})

test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test('Should not fetch other users task bt id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})
