const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route GET api/profile/test
// @desc  Tests profile route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Profile works..." }));

// @route GET api/profile
// @desc  Get current users profile
// @access private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route POST api/profile
// @desc  Create user or edit profile
// @access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id; // includes the avatar, name and email

    // check if handle was sent in from the form, then set it to profileFields.handle
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - split into array by comma
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills.split = req.body.skills.split(',');
    } 

    // Social
    profileFields.social = {};
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;

    // Find User
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile) {
                // Update - set profile fields
                profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields }, 
                    { new: true }
                )
                .then(profile => res.json(profile));
            } else {
                // Create

                // Check to see if handle exists
                Profile.findOne({ handle: profileFields.handle }).then(profile => {
                    if(profile) {
                        errors.handle = 'That handle already exists';
                        res.status(400).json(errors);
                    }

                    // Save profile
                    new Profile(profileFields).save().then(profile => res.json(profile));
                });
            }
        });
});

module.exports = router;

// TODO:
// location
// bio
// social network links