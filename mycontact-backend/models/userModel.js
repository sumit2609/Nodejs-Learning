const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        userName:{
            type: String,
            required:[ true, "Please add the user name" ],
        },
        email:{
            type: String,
            required:[ true, "Please add email"],
            unique:[ true, "email address already taken"],
        },
        password:{
            type: String,
            required: [true, "Please add user password"],
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("User",userSchema)