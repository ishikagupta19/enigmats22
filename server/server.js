require('dotenv').config()
const { config } = require('dotenv')
const express = require("express")
const mongoose = require("mongoose")


const app = express()
app.use(express.json())

//Routes
app.use('/user',require('./routes/userRouter'))


//Connect to mongodb
const URI=process.env.MONGODB_URL
mongoose.connect(URI).then(()=> {
    console.log('connected to MongoDB'); 
}).catch((err)=> {
    if (err) throw err; 
    console.log('no connection')
});

app.get('/',(req,res)=>{
    res.json({msg:"Welcome to my channel , please subscribe for us. Thanks"})
})



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log('Server is running on port',PORT);
})