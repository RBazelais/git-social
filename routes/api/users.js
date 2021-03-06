const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// Load user model
const User = require('../../models/User');

// @route GET api/users/test
// @desc  Tests users route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Users works..." }));

// @route POST api/users/register
// @desc  Register users  
// @access Public
router.post('/register', (req, res) => {
	// 
	const { errors, isValid } = validateRegisterInput(req.body);

	// check validation
    if(!isValid){
		// send entire errors object
		return res.status(400).json(errors);
    }

	// find if the email exists
	console.log(req.body);
	User.findOne({ email: req.body.email }).exec().then( user => {
		console.log("*hacker voice* I'm in! ");
		if(user){
			errors.email = 'Email already exists';
			return res.status(400).json(errors);
		} else {
			// else create newUser
			console.log("Creating a new user");
			const avatar = gravatar.url(req.body.email, {
				s: '200', // size
				r: 'pg', // rating
				d: 'mm' // default
			});

			// take in strings from the form
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar, // avatar: avatar,
				password: req.body.password
			});

			// hash the password
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err){ console.log(err) };
					newUser.password = hash;
					newUser.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
			console.log(`${newUser.name} has been added to the database`);
		}
	});
});

// @route GET api/users/login
// @desc  Login User / Returning JWT Token  
// @access Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	// check validation
	if(!isValid){
		return res.status(400).json(errors);
	}

	const thisEmail = req.body.email;
	const thisPassword = req.body.password;
	
	// Find user by email
	User.findOne({ email: thisEmail })
		.then(user => {
			// validate for user
			if(!user){
				errors.email = 'User not found'
				return res.status(404).json(errors)
			}
			console.log("user exists");
			// validate password (returns a promise)
			bcrypt.compare( thisPassword, user.password ).then( isMatch => {
				if(isMatch){
					// User Matched	
					const payload = { // create jwt payload
						id: user.id, 
						name: user.name, 
						avatar: user.avatar 
					} 

					// Sign the token
					jwt.sign(
						payload, 
						keys.secretOrKey, 
						{ expiresIn: 3600 }, // calculated in sec, expires in 1 hour
						(err, token) => {
							res.json({
								success: true,
								token: 'Bearer ' + token
							});
						});
						console.log("passwords match");
				} else {
					errors.password = 'Incorrect password'
					return res.status(400).json(errors);
				}
			});
		});
});

// @route GET api/users/current
// @desc  Return the current user
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	})
	console.log("current user confirmed");
});

module.exports = router;

// TODO:
// authentication
// login
// passport
