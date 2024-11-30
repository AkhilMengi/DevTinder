const validator = require('validator');

const dataValidation = (req)=>{
    const{firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName){
        throw new Error('Name is not Valid')
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not Valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}



const validateEditProfileData = (req)=>{
    const allowedEditItems=["firstName","lastName","email","age","skills","photo"];

    const isAllowed= Object.keys(req.body).every(field=>allowedEditItems.includes(field));
    return isAllowed;
}


module.exports = {dataValidation,validateEditProfileData}