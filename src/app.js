const express = require('express');
const {connectDB}  = require('./config/database')
const app = express();


connectDB().then(() => {
    console.log("DB is successfully connected")
    app.listen(3100, () => {
        console.log(`Server is listening at 3100`)
    })
}).catch(err => {
    console.log("Error in connecting to DB")
})


