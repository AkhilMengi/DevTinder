const express = require('express');

const app = express();

const data ={
    "firstName":"Akhil",
    "lastName":"Mengi"
}

app.get('/user',(req,res)=>{
    res.send(data)
})

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