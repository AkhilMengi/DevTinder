const express = require('express');
const { connectDB } = require('./config/database')
const app = express();
const User = require('./models/user')
const { dataValidation } = require('./utils/validator')
const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middleware/authorization')


app.use(express.json());
app.use(cookieParser())




app.post("/signup", async (req, res) => {

    try {
        dataValidation(req);
        const { firstName, lastName, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        }); // Create a new User instance with request body


        await user.save(); // Save the user to the database
        res.status(201).send("User added successfully"); // Respond with success
    } catch (error) {
        // Handle validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors,
            });
        }

        // Handle other errors
        res.status(500).json({
            error: "Error occured:",
            details: error.message,
        });
    }
});

app.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        // if(!validator.isEmail(email)){
        //     throw new Error("Invalid Email Id")
        // }

        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            throw new Error("Email is not present in DB")
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (isPasswordValid) {

            const token = await jwt.sign({ _id: existingUser._id }, "SECRET_KEY@123",{expiresIn:'1h'})
            console.log(token)

            res.cookie("token", token,{expires:new Date.now() +900000})

            res.send("User registered Successfully")
        } else {
            throw new Error("Invalid password")
        }

    } catch (error) {
        res.status(500).json({
            error: "Error occured:",
            details: error.message,
        });
    }
})

app.get('/profile', userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("error:" + error.message)
    }

})

app.post('/sendConnectionRequest',userAuth,async(req,res)=>{
    try{
        const user = req.user
        res.send( user.firstName+ "Connnection request Send")
    }catch (error) {
        res.status(400).send("error:" + error.message)
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


