const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth.controller") // get a obj from auth controller
const authMiddleware = require("../middlewares/auth.middleware")
const passport = require("passport")
const jwt = require("jsonwebtoken")



// const {Router} = require("express")
// const authRouter = Router()

authRouter.post("/register",authController.registerUserController)
authRouter.post("/login",authController.loginUserController)
authRouter.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
authRouter.get("/google/callback",passport.authenticate("google",{session:false}),
    (req,res)=>{
        try{
            const token = jwt.sign(
                {id:req.user._id, username:req.user.username},
                process.env.JWT_SECRET,
                {expiresIn:"1d"}
            )
            // res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`)
                        // Save JWT in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            // Redirect to frontend
            res.redirect(process.env.FRONTEND_URL);

        }
        catch{
console.error("Google login error",error)
res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`)
        }
    }
)
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
authRouter.put("/update",authMiddleware.authUser,authController.updateUserController)
authRouter.get("/logout",authController.logoutUserController)


module.exports = authRouter