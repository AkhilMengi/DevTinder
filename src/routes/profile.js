
const express = require('express')

const { userAuth } = require('../middleware/authorization');

const profileRouter = express()

profileRouter.get('/profile', userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("error:" + error.message)
    }

})

module.exports = profileRouter