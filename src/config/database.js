const mongoose = require("mongoose")

const dns = require("node:dns"); // <-- Add this
// Force Node.js to use public DNS servers to bypass Windows network SRV blocks
dns.setServers(["8.8.8.8", "1.1.1.1"]); // <-- Add this

const connectToDB = async()=>{
   try{
     await mongoose.connect(process.env.MONGO_URL)
    console.log("Connect to Database")
   }catch(err){
    console.log(err)
   }
}
module.exports = connectToDB