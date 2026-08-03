// const passport = require('passport')
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
// // import {Srategy as GoogleStrategy} from "passport-google-oauth20"
// const  User = require("../models/user.model")

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:"http://localhost:3000/api/auth/google/callback",
//     proxy:true
//   },
//   async(accessToken, refreshToken, profile, cb)=> {
//     // console.log(profile);
    
//     try {
//       // let user = await User.findOneAndUpdate({ googleId: profile.id }, {isLoggedIn:true});
//       let user = await User.findOne({ googleId: profile.id });
          
//       if(!user){
//         user = await User.create({
//             googleId: profile.id,
//             username:profile.displayName,
//             email:profile.emails[0].value,     
//             isGoogle:true ,
//             avatar:profile.photos[0]?.value || ""
//         })
//       }
//       return cb(null, user);
      
//     } catch (error) {
//       console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
//         return cb(error, null)
//     }
    
//   }
// ));


const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
// import {Srategy as GoogleStrategy} from "passport-google-oauth20"
const  User = require("../models/user.model")


const callbackURL = process.env.NODE_ENV === "production"
  ? `${process.env.BACKEND_URL_PROD}/api/auth/google/callback`
  : `${process.env.BACKEND_URL_DEVE}/api/auth/google/callback`;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    proxy:true

  },
  async(accessToken, refreshToken, profile, cb)=> {
    // console.log(profile);
    
    try {
      // let user = await User.findOneAndUpdate({ googleId: profile.id }, {isLoggedIn:true});
      let user = await User.findOne({ googleId: profile.id });
          
      if(!user){
        user = await User.create({
            googleId: profile.id,
            username:profile.displayName,
            email:profile.emails[0].value,     
            isGoogle:true ,
            avatar:profile.photos[0]?.value || ""
        })
      }

      return cb(null, user);

    } catch (error) {
        return cb(error, null)
    }
    
  }
));