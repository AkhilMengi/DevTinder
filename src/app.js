const express = require('express');
const {connectDB}  = require('./config/database')
const app = express();
const User = require('./models/user')

app.use(express.json());

app.get('/user', async (req, res) => {
    const userEmail = req.body.email; // Use query parameters for GET requests

    if (!userEmail) {
        return res.status(400).json({ error: "Email is required as a query parameter." });
    }

    try {
        const user = await User.findOne({ email: userEmail }); // Use findOne for a single user

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user); // Send the user details
    } catch (error) {
        res.status(500).json({ error: "Cannot fetch user details", details: error.message });
    }
});

app.delete('/user', async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user); // Send the user details

    } catch (error) {
        res.status(500).json({ error: "Cannot fetch user details", details: error.message });
    }
})

app.patch('/user',async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            new:true,
            runValidators:true
        })
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user); // Send the user details

    }catch (error) {
        res.status(500).json({ error: "Cannot fetch user details", details: error.message });
    }
})

app.get('/feed',async (req,res)=>{
    try{
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        
        }

        res.status(200).json(users); // Send the user details
    }catch (error) {
        res.status(500).json({ error: "Cannot fetch user details", details: error.message });
    }
})


app.post("/signup", async (req, res) => {
    const user = new User(req.body); // Create a new User instance with request body

    try {
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
            error: "Error saving user to the database",
            details: error.message,
        });
    }
});




connectDB().then(() => {
    console.log("DB is successfully connected")
    app.listen(3100, () => {
        console.log(`Server is listening at 3100`)
    })
}).catch(err => {
    console.log("Error in connecting to DB")
})


