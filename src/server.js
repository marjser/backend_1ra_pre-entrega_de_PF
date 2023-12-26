const express = require("express")
const router = require('./router')

const app = express() 

app.use(express.json())  

router(app) 


const port = 8080 


app.listen(port, ()=> { 
    console.log(`the server is runing at port ${port}`)
})












  