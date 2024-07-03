const express = require('express')
const cors = require('cors') 
const mongoose =require('mongoose')
const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')

const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())
app.use('/api/users', userRoute)
app.use('/api/chat', chatRoute)


app.get('/', (req,res)=>{
    res.send('welcome')
})



const port = process.env.PORT || 4000
const uri = process.env.ATLAS_URI 

app.listen(port,(req,res)=>{
    console.log(`server running on port: ${port}`)
})

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true}).then(()=>console.log('MongoDB connection established'))
    .catch((error)=> console.log('connection failed', error.message))
