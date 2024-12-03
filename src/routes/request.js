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

// requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
//     try{   const loggedInUser= req.user;
//         const{requestId,status}= req.params;
    
//         const allowedStatus =['accepted','rejected']
//         if(!allowedStatus.includes(status)){
//             return res.status(400).json({message:"Invalid Status"})
//         }
    
//         const connectionRequest = await connectionRequestModel.findOne({
//             _id: requestId,
//             toUserId:loggedInUser._id,
//             status:"intrested"
//         })
//         if(!connectionRequest){
//             return res.status(404).json({message:"request not found"})
//         }
//         connectionRequest.status = status;
//         const data = await connectionRequest.save()
//         res.status(200).json({message:"Connection request found",data})
//     }catch(error){
//         res.send(`Error: ${error.message}`)
//     }
 
// })
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(401).json({ message: "Unauthorized", error: true });
        }

        const { requestId, status } = req.params;

        // // Validate requestId
        // if (!Types.ObjectId.isValid(requestId)) {
        //     return res.status(400).json({ message: "Invalid Request ID", error: true });
        // }

        // Validate status
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status", error: true });
        }

        // Find connection request
        const connectionRequest = await connectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "intrested" // Corrected typo
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Request not found", error: true });
        }

        // Update the status
        connectionRequest.status = status;
        const updatedRequest = await connectionRequest.save();

        // Respond with the updated request
        return res.status(200).json({
            message: "Connection request updated successfully",
            data: {
                id: updatedRequest._id,
                status: updatedRequest.status,
                updatedAt: updatedRequest.updatedAt // Limited response fields
            }
        });
    } catch (error) {
        console.error("Error processing request:", error); // Log error details for debugging
        return res.status(500).json({ message: "Internal server error", error: true });
    }
});

module.exports = requestRouter