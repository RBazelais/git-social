const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');
// Load validation
const validateProfileInput = require('../../validation/profile');

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
        // populate fields from 'users' into the reponse
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// TODO: Write as private; users would have to be logged in to view profiles

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
    const errors = {};
    
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            else {
                console.log(`Profile found at ${req.params.handle}`);
                return res.json(profile);
            }
        
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        } else {
            console.log(`Profile found at ${req.params.user_id}`);
            return res.json(profile);
        }
    })
    .catch(err =>
        res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

// @route POST api/profile
// @desc  Create user or edit profile
// @access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // De-structuring - get errors
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if(!isValid){
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }
    
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
        profileFields.skills = req.body.skills.split(',');
    } 

    // Social
    profileFields.social = {};
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;

    // Find User
    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            // Update
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            ).then(profile => res.json(profile));
        } else {
            // Check if handle exists
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                    errors.handle = 'That handle already exists';
                    return res.status(400).json(errors);
                }

                // Save Profile
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