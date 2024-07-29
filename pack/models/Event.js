const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    _id: {
        type: String,
        default: () => `Event-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    photo: String,
    description: String,

    announcements: [String], // [message_id]
    start: String, // Date ISO String
    place: String, // place_id

    organizers: [String], // [student_id]
    invites: [String], // [student_id]
    rsvps: [String], // [student_id]
    attendees: [String], // [student_id]

    groups: [String], // [group_id]
}, { timestamps: true, collection: 'pack_event' })

const Event = mongoose.model('Event', eventSchema);

module.exports = Event