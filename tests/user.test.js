const request = require('supertest')

const app = require('../src/app')
const UserModel = require('../src/models/user')

const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const res = await request(app)
        .post('/users')
        .send({
            name: 'Mike',
            email: 'mike@example.com',
            password: '123!@#qweQWE'
        })
        .expect(201)

    const user = await UserModel.findById(res.body.user._id)

    expect(user).not.toBeNull()

    expect(user.password).not.toBe('123!@#qweQWE')

    expect(res.body).toMatchObject({
        user: {
            name: 'Mike',
            email: 'mike@example.com'
        },
        token: user.tokens[0].token
    })
})

test('Should log in existing user', async () => {
    const res = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200)

    const user = await UserModel.findById(userOneId)

    expect(user.tokens[1].token).toBe(res.body.token)
})

test('Should not login non-existent user', async () => {
    await request(app)
        .post('/users')
        .send({
            email: 'asddsa@example.com',
            password: 'asdDSAasdDSA'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await UserModel.findById(userOneId)

    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/avatar.jpg')
        .expect(200)

    const user = await UserModel.findById(userOneId)

    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should not upload avatar text file', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/test.txt')
        .expect(400)
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Name changed'
        })
        .expect(200)

    const user = await UserModel.findById(userOneId)

    expect(user.name).toBe('Name changed')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'NYC'
        })
        .expect(400)
})
