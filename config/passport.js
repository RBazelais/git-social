 const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {}; // options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

 // 
 module.exports = passport => {
    passport.use(new JwtStrategy (opts, ( jwt_payload, done ) => {
        User.findById(jwt_payload.id) 
		.then(user => {
			if(user){
				// if the user is valid return no err(null) and then the user object
				return done(null, user);
			}
			return document(null, false);
		})
		.catch(err => console.log(err))
    }));
 };