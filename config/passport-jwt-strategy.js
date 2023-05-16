const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment')
const User = require('../models/user');

//setting options for payloads and header
   //payloads contains all information of user from database
   //header is the part of server where json is in the form of incypted ordecrypted
let opts = {
jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
secretOrKey : env.jwt_secret
}

passport.use(new JWTStrategy(opts, async (jwtPayLoad, done) => {
    let user =await User.findById(jwtPayLoad._id);
    
    if(user){
        done(null, user);
    }else{
        done(null, false);
    }

}));

module.exports = passport;