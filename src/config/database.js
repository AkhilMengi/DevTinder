const mongose = require('mongoose');


const connectDB = async () => {
    await mongose.connect("mongodb+srv://akhilmengi7:SttxXLsOBrr81dhZ@namastenode.7sorq.mongodb.net/devTinder")

}
module.exports= {connectDB}

