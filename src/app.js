const express = require('express');
const {connectDB}  = require('./config/database')
const app = express();
const User = require('./models/user')

app.use(express.json());

app.post("/signup",async(req,res)=>{

    const user = new User(req.body)
    try{
        
        await user.save();
        res.send("User added Successfully")
    }catch(error){
        res.status(500).send("Error Saving user to  DB"+ error.message)
    }
   
})



connectDB().then(() => {
    console.log("DB is successfully connected")
    app.listen(3100, () => {
        console.log(`Server is listening at 3100`)
    })
}).catch(err => {
    console.log("Error in connecting to DB")
})


