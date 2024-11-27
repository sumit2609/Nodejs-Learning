const express = require("express")
const dotenv = require("dotenv").config()
const connectDb = require("./config/dbConnection")
const redisClient = require("./config/redisConnection")

connectDb()
const app = express()

//used to get body from the request
app.use(express.json())

//middleware to send request to contact Route
app.use("/api/contacts",require("./routes/contactRoutes"))
app.use("/api/user",require("./routes/userRoutes"))

const port = process.env.PORT||5000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})