const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.send("Hello From Dashboard")
});
app.get("/test",(req,res)=>{
    res.send("Hello From Test")
})
app.get("/hello",(req,res)=>{
    res.send("Hello From Hello World")
})

app.listen(3100,()=>{
    console.log(`Server is listening at 3100`)
})