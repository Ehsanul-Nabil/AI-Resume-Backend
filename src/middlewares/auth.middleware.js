const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


const authUser = async(req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
// console.log("tokentoken ",token)
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized access, token is Invalid and Expired"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = decoded
        // console.log("useruser : ",user)
        req.user = user
        // console.log("From AuthMiddleWare")
        return next()
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}


module.exports = {
    authUser
}