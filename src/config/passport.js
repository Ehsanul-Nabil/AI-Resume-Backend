const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
// import {Srategy as GoogleStrategy} from "passport-google-oauth20"
const  User = require("../models/user.model")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback",
    proxy:true,
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