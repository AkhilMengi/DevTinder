const express = require('express')
const bcrypt = require('bcrypt')
const { dataValidation } = require('../utils/validator')
const User = require('../models/user')

const authRouter = express();
authRouter.post("/signup", async (req, res) => {

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

authRouter.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            throw new Error("Email is not present in DB")
        }
        const isPasswordValid = await existingUser.validatePassword(password)
        if (isPasswordValid) {

            const token = await existingUser.getJWT()
            console.log(token)
            const expirationDate = new Date(Date.now() + 15 * 60 * 1000);
            res.cookie("token", token,{expires: expirationDate})

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

module.exports = authRouter;