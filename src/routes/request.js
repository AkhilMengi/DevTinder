const express = require('express')
const { userAuth } = require('../middleware/authorization');
const{connectionRequestModel} = require('../models/connectionRequest')
const requestRouter = express()

requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId= req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new connectionRequestModel({
            toUserId,
            fromUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message:"Request Successfully send",
            data
        
        })
           
    }catch (error) {
        res.status(400).send("error:" + error.message)
    }
})

module.exports = requestRouter