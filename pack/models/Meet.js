const mongoose = require('mongoose')
const Schema = mongoose.Schema

const meetSchema = new Schema({
    _id: {
        type: String,
        default: () => `Meet-${new mongoose.Types.ObjectId()}`,
    },

    stage: String, // 'None' | 'Pending' | 'Meeting' | 'Ended'
    place: String, // place_id
    chat: String, // chat_id

    attendees: [String], // [student_id]
    accepted: [String], // [student_id]
}, { timestamps: true, collection: 'pack_meet' })

const Meet = mongoose.model('Meet', meetSchema);

module.exports = Meet