const express = require('express')
const mainRouter = express.Router()

/**
 * GET - Page not found route
 * @returns {Object | null} Object with message
 */
mainRouter.get('*', (req, res) => {
    res.send({
        message: `Looks like you're looking for a page that doens't exist :(`,
        title: 'Page not found'
    })
})

module.exports = mainRouter
