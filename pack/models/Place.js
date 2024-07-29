const mongoose = require('mongoose')
const Schema = mongoose.Schema

const placeSchema = new Schema({
    _id: {
        type: String,
        default: () => `Place-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    photo: String,
    description: String,

    address: String,
    location: [Number], // [latitude, longitude]

    creator: String, // student_id
}, { timestamps: true, collection: 'pack_place' })

const Place = mongoose.model('Place', placeSchema);

module.exports = Place