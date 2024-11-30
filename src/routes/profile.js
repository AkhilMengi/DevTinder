
const express = require('express')

const { userAuth } = require('../middleware/authorization');
const{validateEditProfileData} = require('../utils/validator')

const profileRouter = express()

profileRouter.get('/profile/view', userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("error:" + error.message)
    }

})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
       if(!validateEditProfileData(req)){
        throw new Error("Invalid edit fields")
       }

       const loggedInUser = req.user;
       Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

      await  loggedInUser.save()
       res.send(`${loggedInUser.firstName},your profile was updated`)

    }catch (error) {
        res.status(400).send("error:" + error.message)
    }
})

module.exports = profileRouter