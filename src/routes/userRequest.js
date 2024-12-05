const express = require('express')

const userRouter = express();
const { userAuth } = require('../middleware/authorization')
const {connectionRequestModel} = require('../models/connectionRequest')
const User = require('../models/user')

userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests= await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId",["firstName"])

        const simplifiedData = connectionRequests.map(request => ({
            fromUser: request.fromUserId.firstName, // Populated firstName
            requestTime:request.createdAt,
            requestId: request._id // Include any additional details if needed
        }));
        res.status(200).json({
            message:"Pending Requests",
            data:simplifiedData
        })


    }catch(error){
        res.status(500).send(`Error: ${error.message}`)
    }
})


userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{

        const loggedInUser = req.user;


        const connectionRequests= await connectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]   
           
            
        }).populate("fromUserId",["firstName"]).populate("toUserId",["firstName"])

        const simplifiedData = connectionRequests.map((row)  => {
            if(row.fromUserId.toString() === loggedInUser._id.toString()){
                return row.toUserId
             }else{
                return row.fromUserId
             }
        });

        res.status(200).json({
            message:"Connections",
            data:simplifiedData
        })
        
    }catch(error){
        res.send(`Error: ${error.message}`)
    }
})
userRouter.get('/feed',userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequest = await connectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        })
        // console.log(connectionRequest)

        const hiddenUser = new Set();
        connectionRequest.forEach((req)=>{
            hiddenUser.add(req.fromUserId.toString());
            hiddenUser.add(req.toUserId.toString())
        })
        // console.log(hiddenUser)

        const users = await User.find({
            $and:[
                {_id:{$nin: Array.from(hiddenUser)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        })
        // console.log(users)

        res.send(users)

    }catch(error){
        res.status(500).json(`Error:${error.message}`)
    }
})

module.exports = {userRouter};