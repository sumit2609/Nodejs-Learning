const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateTokenHandler")

const {registerUser,loginUser,currentUser,forgotPassword,resetPassword} = require("../controllers/userController")

router.post("/register",registerUser)

router.post("/login",loginUser)

router.get("/current",validateToken,currentUser)

router.post("/forgotPassword",forgotPassword);

router.post("/reset-password",resetPassword)
module.exports = router