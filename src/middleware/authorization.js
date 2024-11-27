const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Kindly please login")
        }
        const decodedObj = await jwt.verify(token, "SECRET_KEY@123");
        const { _id } = decodedObj;
        const user = await User.findById(_id)
        if(!user){
            throw new Error("User not found")
        }
        req.user = user;
        next();
    }catch(error){
        res.send("error:" + error.message)
    }
   
}

module.exports = { userAuth }