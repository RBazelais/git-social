// posts + comments
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');

// Profile Model
const Profile = require('../../models/Profile');

// Validate Post
const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc  Tests post route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Posts works..." }));

// @route GET api/posts
// @desc  Get Posts
// @access public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 }) // sort by date
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'Posts?! What Posts >.>' }));
    // console.log('Found all posts');
});

// @route GET api/posts/:id
// @desc  Get Post by id
// @access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post with this ID cannot be found' }));
    // console.log(`Post ID: ${req.params.id} found`);
});

// @route POST api/posts
// @desc  Create a post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
    console.log('Posted successfully');
});

// @route Delete api/posts/:id
// @desc  Delete a post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Get user that owns the post
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // find the post by id
            Post.findById(req.params.id)
                .then(post => {
                    // check for post owner | req.user.id will come in as a string
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({ notauthorized: 'User not authorized'});
                    }

                    // Delete
                    post.remove().then(() => res.json({ success: 'true' }));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
        })
        .catch(err => res.status(404).json({ profile: 'Something is not right with this user...' }));
});

// @route Post api/posts/like/:id
// @desc  Like a post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            // Is the user.id that matches in the likes array?
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ alreadyliked: 'User already liked this post' });
            }

            // Add user id to likes array
            post.likes.unshift({ user: req.user.id });

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});

// @route Post api/posts/unlike/:id
// @desc  Unlike
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({ notliked: 'You have not yet liked this post' });
            }

            // Get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

            // Splice out of array
            post.likes.splice(removeIndex, 1);

            // Save
            post.save().then(post => res.json(post));
            // console.log(`User ${req.user.name} unliked this post: ${req.params.id}`);

        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});



module.exports = router;