const express = require('express')
const { userAuth } = require('../middleware/authorization');

const requestRouter = express()

requestRouter.post('/sendConnectionRequest',userAuth,async(req,res)=>{
    try{
        const user = req.user
        res.send( user.firstName+ "Connnection request Send")
    }catch (error) {
        res.status(400).send("error:" + error.message)
    }
})

module.exports = requestRouter