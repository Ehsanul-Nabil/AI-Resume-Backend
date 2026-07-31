const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const registerUserController = async (req,res) =>{
const { username, email, password } = req.body

if (!username || !email || !password) {
    return res.status(400).json({
        message: "Please provide username, email and password"
    });
}

const isUserAlreadyExists =  await userModel.findOne({
    $or: [{ username }, { email }]
});

if (isUserAlreadyExists) {
    return res.status(400).json({
        message: "User already exists with this username or email"
    });
}

const hash = await bcrypt.hash(password,10)

const user = await userModel.create({
    username,
    email,
    password:hash,
})

const token = jwt.sign(
    {id:user._id,username:user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
)

res.cookie("token",token)

return res.status(201).json({
    message:"User Registration Successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})


}

const loginUserController = async(req,res)=>{
const { email, password } = req.body

const user = await userModel.findOne({ email })

if (!user) {
    return res.status(400).json({
        message: "Invalid email or password"
    })
}

const isPasswordValid = await bcrypt.compare(password, user.password)

if (!isPasswordValid) {
    return res.status(400).json({
        message: "Invalid email or password"
    })
}

const token = jwt.sign(
    {id:user._id,username:user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
)

res.cookie("token",token)

return res.status(200).json({
    message:"User LoggedIn Successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

const logoutUserController = async(req,res)=>{
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(200).json({
                message: "User already logged out successfully"
            })
        }

        // res.cookie("token", "")
        res.clearCookie("token");

        await tokenBlacklistModel.create({
            token: token
        })

        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController

}