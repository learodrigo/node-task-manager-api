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
const PORT = process.env.PORT || 3000

// App config & Routers
app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)
app.use(mainRouter)

// Run at PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
