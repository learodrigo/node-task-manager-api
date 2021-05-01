const mongoose = require('mongoose')

const connectionURL = `mongodb://127.0.0.1:27017/${process.env.TASK_MANAGER_API_ENDPOINT}`
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(connectionURL, connectionOptions)
