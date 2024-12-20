const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLenght: 3,
        maxLength: 15,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email) {
                // Regular expression for validating email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    }, password: {
        type: String,
        // required: true,
        trim: true,
        // minLength: 5,
        // maxLength: 20,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value)

            }
        }
    },confirmPassword: {
        type: String,
        // required: true,
        trim: true,
        // minLength: 5,
        // maxLength: 20,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value)

            }
        }
    }, gender: {
        type: String,
        // required: true,
        validate: {
            validator: function (value) {
                // Allowed values for gender
                const allowedGenders = ['male', 'female', 'others'];
                return allowedGenders.includes(value.toLowerCase());
            },
            message: props => `${props.value} is not a valid gender! Only 'male', 'female', or 'others' are allowed.`,
        }
    }, age: {
        type: Number,
        min: 18,
        // required: true,
    }, photo: {
        type: String,
        default: "http://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1732441727~exp=1732445327~hmac=53706f44398272660c8386633d9f29a1754a6dbf40354aa030067b49a318a3b7&w=740",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL")

            }
        }
    }, skills: {
        type: [String]
    }
},{
    timestamps:true
})

userSchema.methods.getJWT= async function (){

    const existingUser = this;
    const token = await  jwt.sign({ _id: existingUser._id }, "SECRET_KEY@123",{expiresIn:'1h'})
    return token;
    
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const existingUser = this;
    const passwordHash = existingUser.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid;
}
const User = mongoose.model("User", userSchema)

module.exports = User;