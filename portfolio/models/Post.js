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
    photo: String, // photo_id
    
    maxWidth: String,
    maxHeight: String,
    minWidth: String,
    minHeight: String,
    photoWidth: String,
    photoHeight: String,
    color: String,
    backgroundColor: String,
    link: String,
    flexDirection: String,
}, { timestamps: true, collection: 'portfolio_post' })

postSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const Post = mongoose.model('Post', postSchema);

module.exports = Post