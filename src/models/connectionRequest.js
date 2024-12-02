const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema({
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },status:{
        type:String,
        enum:{
            values:["ignored","accepted","intrested","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{timestamps:true})

const connectionRequestModel = mongoose.model("connectionRequestModel",connectionRequest)

module.exports = {connectionRequestModel}