const mongoose = require('mongoose')
const Schema = mongoose.Schema

const photoSchema = new Schema({
    _id: {
        type: String,
        default: () => `Photo-${new mongoose.Types.ObjectId()}`,
    },

    path: String,
}, { timestamps: true, collection: 'photo' })

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo