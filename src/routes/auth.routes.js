const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth.controller") // get a obj from auth controller
const authMiddleware = require("../middlewares/auth.middleware")


// const {Router} = require("express")
// const authRouter = Router()

authRouter.post("/register",authController.registerUserController)
authRouter.post("/login",authController.loginUserController)
authRouter.get("/logout",authController.logoutUserController)
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)


module.exports = authRouter