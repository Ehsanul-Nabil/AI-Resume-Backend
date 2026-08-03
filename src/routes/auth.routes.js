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
authRouter.get("/google/callback",passport.authenticate("google",{session:false}),authController.googleAuthController)
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
authRouter.put("/update",authMiddleware.authUser,authController.updateUserController)
authRouter.get("/logout",authController.logoutUserController)


module.exports = authRouter