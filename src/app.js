const express = require('express');

const app = express();

const {adminAuth,userAuth} = require('../middleware/authorization')

const data ={
    "firstName":"Akhil",
    "lastName":"Mengi"
}

app.use('/admin',adminAuth)

app.get('/admin/getAllUser',(req,res)=>{
    res.send("All information")
})

app.get('/admin/deleteUser',(req,res)=>{
    res.send("User deleted")
})

app.get('/user',adminAuth, (req, res, next) => {
    console.log("1st handler");
    res.send("Response from the first handler"); // Sends response and ends request
    
});



app.post('/user',(req,res)=>{
    res.send("User added successfully")
})

app.patch('/user',(req,res)=>{
    res.send("Information is updated in DB")
})
app.delete('/user',(req,res)=>{
    res.send("User deleted Successfully")
})

app.listen(3100,()=>{
    console.log(`Server is listening at 3100`)
})