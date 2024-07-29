const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    _id: {
        type: String,
        default: () => `Group-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    photo: String,
    description: String,

    announcements: [String], // [message_id]
    purpose: String, // 'Frat' | 'Sorority' | 'Club' | 'Business' | 'Team' | 'Group'

    owners: [String], // [student_id]
    admins: [String], // [student_id]
    members: [String], // [student_id]
    followers: [String], // [student_id]

    events: [String], // [event_id]
    chats: [String], // [chat_id]
}, { timestamps: true, collection: 'pack_group' })

const Group = mongoose.model('Group', groupSchema);

module.exports = Group