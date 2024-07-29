const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    _id: {
        type: String,
        default: () => `Message-${new mongoose.Types.ObjectId()}`,
    },

    sender: String, // student_id
    text: String,

    // Attachments
    photos: [String], // [photo_id]
    event: String, // event_id
    group: String, // group_id
    location: [Number], // [latitude, longitude]
}, { timestamps: true, collection: 'pack_message' })

const Message = mongoose.model('Message', messageSchema);

module.exports = Message