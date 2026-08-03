const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

// const registerUserController = async (req,res) =>{
// const { username, email, password } = req.body

// if (!username || !email || !password) {
//     return res.status(400).json({
//         message: "Please provide username, email and password"
//     });
// }

// const isUserAlreadyExists =  await userModel.findOne({
//     $or: [{ username }, { email }]
// });

// if (isUserAlreadyExists) {
//     return res.status(400).json({
//         message: "User already exists with this username or email"
//     });
// }

// const hash = await bcrypt.hash(password,10)

// const user = await userModel.create({
//     username,
//     email,
//     password:hash,
// })

// const token = jwt.sign(
//     {id:user._id,username:user.username},
//     process.env.JWT_SECRET,
//     {expiresIn:"1d"}
// )

// // res.cookie("token",token) // for Development (Local Host) 
// res.cookie("token", token, { // For Production(Vercel Render)
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 24 * 60 * 60 * 1000,
// });

// return res.status(201).json({
//     message:"User Registration Successfully",
//     user:{
//         id:user._id,
//         username:user.username,
//         email:user.email
//     }
// })


// }

const registerUserController = async (req, res) => {
const { username, email, password, phone, address } = req.body;

if (!username || !email || !password) {
    return res.status(400).json({
        message: "Please provide username, email and password"
    });
}

const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }]
});

if (isUserAlreadyExists) {
    return res.status(400).json({
        message: "User already exists with this username or email"
    });
}

const hash = await bcrypt.hash(password, 10);

const user = await userModel.create({
    username,
    email,
    password: hash,
    // If phone or address are provided in req.body, they will be saved. 
    // Otherwise, your Mongoose schema defaults ("Not Set") will automatically apply!
    ...(phone && { Phone: phone }),
    ...(address && { address })
});

const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);

res.cookie("token", token, { // For Production(Vercel Render)
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
});

return res.status(201).json({
    message: "User Registration Successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isGoogle: user.isGoogle,
        avatar:user.avatar
    }
});

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

// res.cookie("token",token)
res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
});

return res.status(200).json({
    message:"User LoggedIn Successfully",
    user:{
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isGoogle: user.isGoogle,
        avatar:user.avatar

    }
})
}

const googleAuthController= async (req,res)=>{
        try{
            const token = jwt.sign(
                {id:req.user.id, username:req.user.username},
                process.env.JWT_SECRET,
                {expiresIn:"1d"}
            )
        //   console.log("Inside the GoogleAuthController")
            const isProduction = process.env.NODE_ENV === "production";
            const frontendURL = (isProduction ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL);

            // res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            console.log(frontendURL)

            // Redirect to frontend
            res.redirect(frontendURL);

        }
        catch{
console.error("Google login error",error)
res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`)
        }
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
    console.log("requesi=tijjkfcjkdjfk id ",req.user._id)
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
        email: user.email,
        phone: user.phone,
        address: user.address,
        isGoogle: user.isGoogle,
        avatar:user.avatar

        }
    });
}

/**
 * @name updateUserController
 * @description update current logged in user details (phone, address) excluding username and email
 * @access private
 */
const updateUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { phone, address } = req.body;

        // Build an update object with only allowed fields
        const updateData = {};
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;

        // Perform the update without extra options
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Fetch the latest updated record to send back in response
        const freshUser = await userModel.findById(userId);

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: freshUser._id,
                username: freshUser.username,
                email: freshUser.email,
                phone: freshUser.phone,
                address: freshUser.address,
                isGoogle: freshUser.isGoogle,
                avatar: freshUser.avatar
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};



module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUserController,
    googleAuthController

}