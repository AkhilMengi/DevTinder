const express = require('express')
const bcrypt = require('bcrypt')
const { dataValidation } = require('../utils/validator')
const{userAuth} = require('../middleware/authorization')
const User = require('../models/user')

const validator = require('validator');

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

authRouter.post('/logout', async (req, res) => {
    try {
      // Invalidate the cookie by clearing it
      res.cookie("token", "", { 
        expires: new Date(0), // Expire the cookie immediately
        httpOnly: true, // Prevent client-side access
        secure:true, // Only use HTTPS in production
        sameSite: 'strict' // Prevent CSRF attacks
      });
  
      res.status(200).json({ message: "User successfully logged out" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "An error occurred during logout" });
    }
  });
//   authRouter.post('/logout', async (req, res) => {
//     try {
//       // Extract refresh token from secure cookie
//       const refreshToken = req.cookies.refreshToken;
  
//       if (!refreshToken) {
//         return res.status(400).json({ message: "No refresh token provided" });
//       }
  
//       // Invalidate refresh token in the database
//       await db.collection('refreshTokens').deleteOne({ token: refreshToken });
  
//       // Optionally, block the access token
//       const accessToken = req.headers.authorization?.split(' ')[1];
//       if (accessToken) {
//         revokeToken(accessToken, 15 * 60); // Add to blocklist for 15 minutes
//       }
  
//       // Clear cookies on the client
//       res.cookie("refreshToken", "", { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict' });
//       res.cookie("accessToken", "", { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict' });
  
//       res.status(200).json({ message: "User successfully logged out" });
//     } catch (error) {
//       console.error("Logout error:", error);
//       res.status(500).json({ message: "An error occurred during logout" });
//     }
//   });


authRouter.post('/passwordRestore',async(req,res)=>{
    try{

    }catch(error){
        
    }
})

authRouter.post('/changePassword', userAuth, async (req, res) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).send("Password does not meet strength requirements.");
        }

        const user = req.user;

        // Step 5: Compare the current password with the stored hashed password using bcrypt
        const isMatch = await user.validatePassword(password) // Make sure both args are provided
        if (!isMatch) {
            return res.status(400).send("Current password is incorrect.");
        }

        // Step 6: Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 7: Update the password in the database
        user.password = hashedPassword;
        await user.save();


        res.send({ message: "Password updated successfully." });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

  
module.exports = authRouter;