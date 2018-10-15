// Post Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
	// Associate user by ID
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
	text: {
		type: String,
		required: true
	},
	name: {
        type: String 
    },
    avatar: {
        type: String
    },
    // Likes are an array of user_id(s)
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
            
        }
    ],
    // comments include the user's name, avatar and date
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String 
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                Default: Date.Now
            }
        }
    ],
    // The post itself has a date
    date: {
        type: Date,
        Default: Date.Now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);
