const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//@desc POST register
//@route POST /api/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body
    //check if all mandatory fields are there or not
    if(!name||!email||!password){
        res.status(404)
        throw new Error("Please fill the required entry")
    }
    //check if email exist in db or not
    const userAvailable = await User.findOne({email})
    if(userAvailable){ 
        res.status(400)
        throw new Error("User already exist")
    }

    //Hash password
    const hashPassword = await bcrypt.hash(password,10)
    console.log("Hashed Password :",hashPassword)
    const user = await User.create({
        userName:name,
        email,
        password:hashPassword,
    })

    console.log("user created",user)
    if(user){
        res.status(201).json({_id:user.id,email:user.email})
    }else{
        res.status(400)
        throw new Error("user data is not valid")
    }
})

//@desc POST login
//@route POST /api/login
//@access public
const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body

    if(!email||!password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    //find if user with email exists in our DB or not
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        //accessToken is a string return by jwt sign method
        const accessToken = jwt.sign({
            user:{
                name:user.userName,
                email:user.email,
                id:user.id,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    )
        res.status(200).json(accessToken)
    }else{
        res.status(400)
        throw new Error("Email or Password is invalid")
    }
})
//@desc GET current user
//@route GET /api/current
//@access private
//authenticated user can access to this route
//we need to create middleware for authentication
//we need to send to token to request and validate it and check it 
//is assosiated to the correct user
const currentUser = asyncHandler( (req,res) => {
    res.status(200).json(req.user)
})

module.exports = {
    registerUser,
    loginUser,
    currentUser
}