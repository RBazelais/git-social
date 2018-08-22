const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../../models/User');

// @route GET api/users/test
// @desc  Tests users route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Users works..." }));

// @route GET api/users/register
// @desc  Register users  
// @access Public
router.post('/register', (req, res) => {
	// find if the email exists
	console.log(req.body);
	User.findOne({ email: req.body.email }).exec().then( user => {
		console.log("i'm in!");
		if(user){
			return res.status(400).json({ email: 'Email already exists' });
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

module.exports = router;

// TODO:
// authentication
// login
// passport
