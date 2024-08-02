const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const postSchema = new Schema({
    _id: {
        type: String,
        default: () => `Post-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    description: String,
    selectors: String,
    urls: [String], // urls
    captions: [String],
    essay: String,
    link: String,
    color: String,
    backgroundColor: String,
    start: String,
    end: String,
    location: String,
}, { timestamps: true, collection: 'portfolio_post' })

const Post = mongoose.model('Post', postSchema);

module.exports = Post