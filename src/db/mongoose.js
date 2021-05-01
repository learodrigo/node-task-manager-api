const mongoose = require('mongoose')

const connectionURL = `mongodb://127.0.0.1:27017/${process.env.TASK_MANAGER_API_ENDPOINT}`

const connectionOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(connectionURL, connectionOptions)
