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
        // required:[true,"Password is required"]
    },
    googleId: { type: String},
    isGoogle:{
          type:Boolean,
          default:false
    },
    avatar:{
        type:String,
        default: ""
    },
    role: {
        type: String,
        default: "user" 
    },
    address:{
        type:String,
        default:"Not Set"
    },
    phone:{
        type:String,
        default:"Not Set"
    }


},{ timestamps: true }
)

const userModel = mongoose.model("users",userSchema) // user collection

module.exports = userModel