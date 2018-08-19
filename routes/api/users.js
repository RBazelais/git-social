// authentication
// login
// passport

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');

// Load user model
const User = require('../../models/User');

// @route GET api/users/test
// @desc  Tests users route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Users works..." }));

// @route GET api/users/register
// @desc  register users route
// @access public
router.post('/register', (req, res) => {
    //find if the email exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user){
                return res.status(400).json({ email: 'Email already exists' });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg', // rating
                    d: 'mm' // Default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar, // avatar: avatar,
                    password: req.body.password
                });
            }
        })
});

module.exports = router;