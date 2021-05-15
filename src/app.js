// Modules
const express = require('express')
require('dotenv').config()
require('./db/mongoose')

// Routers
const userRouter = require('./routes/users')
const tasksRouter = require('./routes/tasks')
const mainRouter = require('./routes/main')

// Express app
const app = express()

// App config
app.use(express.json())

// Routers
app.use(userRouter)
app.use(tasksRouter)
app.use(mainRouter)

module.exports = app
