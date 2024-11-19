const mongoose = require("mongoose")

//mongoose schema contains the object of schema type
const contactSchema = mongoose.Schema(
    {
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name:{
            type: String,
            required: [true, "Please add the contact name"],
        },
        email:{
            type: String,
            required: [true, "Please add the contact email address"],
        },
        phone:{
            type: String,
            required: [true, "Please add the contact phone number"],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Contact",contactSchema)