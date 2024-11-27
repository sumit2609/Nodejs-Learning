const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
//const redisClient = require('../config/redisConnection')

const redis = require('redis');

// Connect to Redis
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379', // Redis URL connection (default)
});
//redisClient.connect();
(async () => {
    try {
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  })();

  // Error handling for Redis
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

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

const forgotPassword = asyncHandler(async (req,res) => {
    let testAccount = await nodemailer.createTestAccount();
    console.log(testAccount)

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: "myah.steuber90@ethereal.email",
            pass: "57NYvvNCrUZEjgabs1"
        }
    });
console.log(transporter)
    const { email } = req.body;
  // Generate a unique token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Set the token in Redis with an expiration of 1 hour (3600 seconds)
    await redisClient.setEx(`reset_token_${resetToken}`, 3600, email);

  // Construct the reset link
    const resetLink = `http://localhost:${process.env.PORT}/api/user/reset-password?token=${resetToken}`;
    console.log(resetLink)
  // Send the reset email
    const mailOptions = {
        from: "sumiteees@gmail.com",
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
})

const resetPassword = asyncHandler(async (req,res) => {
    //console.log(req);
    const { token } = req.query;
    const {password} = req.body;
    console.log(token)
    console.log(password)
    // Verify the token from Redis
    const email = await redisClient.get(`reset_token_${token}`);
    console.log(email)

    if (!email) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const userAvailable = await User.findOne({email})

    if(!userAvailable){
        return res.status(400).json({ error: 'User do not exist' });
    }

    userAvailable.password = password

    await userAvailable.save()

    // Delete the token from Redis
    await redisClient.del(`reset_token_${token}`);

   res.status(200).json({ message: 'Password has been reset successfully' });
})

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    forgotPassword,
    resetPassword
}