const mongoose = require('mongoose')

const connectionURL = process.env.TASK_MANAGER_API_ENDPOINT

const connectionOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(connectionURL, connectionOptions)
