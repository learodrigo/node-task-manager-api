const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

const auth = async (req, res, next) => {
    // console.log(req.method, req.path)
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

        const user = await UserModel.findOne({
            _id: decoded._id,
            "tokens.token": token
        })

        if (!user) {
            throw new Error('You need authentification')
        }

        req.token = token
        req.user = user

        next()
    }
    catch (e) {
        res.status(401).send({ error: 'You need authentification' })
    }
}

module.exports = auth
