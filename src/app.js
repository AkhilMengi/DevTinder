const express = require('express');
const { connectDB } = require('./config/database')
const app = express();
const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middleware/authorization');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const {userRouter} = require('./routes/userRequest')


app.use(express.json());
app.use(cookieParser())

app.use('/',authRouter);
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)




connectDB().then(() => {
    console.log("DB is successfully connected")
    app.listen(3100, () => {
        console.log(`Server is listening at 3100`)
    })
}).catch(err => {
    console.log("Error in connecting to DB")
})


