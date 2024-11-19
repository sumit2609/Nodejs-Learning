const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler(async (req,res,next) => {
    let token;
    let authHeader = req.headers.authorization||req.headers.authorization
    //console.log(authHeader)
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
        //console.log(token)
        //verifying token and a call back function
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload) => {
            if(err){
                res.status(401)
                throw new Error("User is not authorized")
            }
            req.user = payload.user
            next()
        })
        if(!token){
            res.status(401)
            throw new Error("User not authorized or token is missing")
        }
    }
})

module.exports = validateToken