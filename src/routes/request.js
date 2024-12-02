const express = require('express')
const { userAuth } = require('../middleware/authorization');
const{connectionRequestModel} = require('../models/connectionRequest')
const User = require('../models/user')
const requestRouter = express()

requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId= req.params.toUserId;
        const status = req.params.status;
        if(fromUserId == toUserId){
            return res.status(400).json({
                message:"You are not authrized to send the request to yourself"
            })
        }
       const toUser = await User.findById(toUserId);
       console.log(toUser)
       if(!toUser){
        return res.status(404).json({
            message:"The user not found"
        })
       }

        const allowedStatus =['ignored','intrested'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:`Invalid status:${status}`})     
        }

        const connectionRequest = new connectionRequestModel({
            toUserId,
            fromUserId,
            status
        })

        const existingRequest = await connectionRequestModel.findOne({
            $or: [
               {fromUserId,toUserId} ,
               {fromUserId:toUserId,toUserId:fromUserId}
            ],
            
        })
        if(existingRequest){
            return res.status(400).json({message:"Request already Exist"})
        }
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