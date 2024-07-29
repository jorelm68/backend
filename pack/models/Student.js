const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    _id: {
        type: String,
        default: () => `Student-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    photo: String,
    description: String,
    account: String, // account_id

    username: String,

    groups: [String], // [group_id]
    chats: [String], // [chat_id]
    events: [String], // [event_id]
    traits: [String], // [trait_id]

    friends: [String], // [student_id]
    outgoingRequests: [String], // [student_id]
    incomingRequests: [String], // [student_id]

    notifications: [String], // [notification_id]
}, { timestamps: true, collection: 'pack_student' })

const Student = mongoose.model('Student', studentSchema);

module.exports = Student