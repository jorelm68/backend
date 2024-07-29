const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    _id: {
        type: String,
        default: () => `Chat-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    photo: String,
    description: String,

    messages: [String], // [message_id]
    members: [String], // [student_id]
}, { timestamps: true, collection: 'pack_chat' })

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat