const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username already taken"],
        required:true
    },
    email:{
        type:String,
        unique:[true,"Account already exists with this email address"],
        required:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    }
})

const userModel = mongoose.model("users",userSchema) // user collection

module.exports = userModel