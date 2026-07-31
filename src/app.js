const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser()) // cookie-parser. Without it, Express cannot read or parse incoming cookies from the browser.
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}))

app.use("/api/auth",authRouter) // auth api prefix
app.use("/api/interview",interviewRouter)

module.exports = app


// app.use(...): Registers middleware or a router in your Express application.

// "/api/auth": This is the common path prefix for all routes inside authRouter.


// res.cookie() (Writing/Sending): Works natively out of the box. Express sends the cookie to the client.

// req.cookies (Reading/Parsing): Requires cookie-parser. When the browser sends that cookie back to your server in a future request, Express cannot read what is inside req.cookies unless cookie-parser is installed to parse the incoming cookie header.