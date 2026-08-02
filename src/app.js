const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser()) // cookie-parser. Without it, Express cannot read or parse incoming cookies from the browser.
app.use(cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL_PROD,
      ],
    credentials:true // for Cookies
}))

app.use("/api/auth",authRouter) // auth api prefix
app.use("/api/interview",interviewRouter)
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NextHire API</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-950 text-slate-100 flex items-center justify-center h-screen">
            <div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <div class="flex items-center space-x-3 mb-4">
                    <span class="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></span>
                    <h1 class="text-xl font-bold tracking-wide">NextHire Backend API</h1>
                </div>
                <p class="text-slate-400 text-sm mb-6">Status: <span class="text-emerald-400 font-semibold">Online & Running</span></p>
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
                    {
                      "status": "success",
                      "message": "NextHire Backend is running successfully!"
                    }
                </div>
            </div>
        </body>
        </html>
    `);
});

module.exports = app


// app.use(...): Registers middleware or a router in your Express application.

// "/api/auth": This is the common path prefix for all routes inside authRouter.


// res.cookie() (Writing/Sending): Works natively out of the box. Express sends the cookie to the client.

// req.cookies (Reading/Parsing): Requires cookie-parser. When the browser sends that cookie back to your server in a future request, Express cannot read what is inside req.cookies unless cookie-parser is installed to parse the incoming cookie header.