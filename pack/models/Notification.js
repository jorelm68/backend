const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    _id: {
        type: String,
        default: () => `Notification-${new mongoose.Types.ObjectId()}`,
    },

    title: String,
    body: String,

    // Receive a friend request
    // Someone accepts your friend request

    // Be added to a group
    // A new announcement is added to a group

    // Be added to a chat
    // A new message is added to a chat

    // Be invited to an event
    // A new announcement is added to an event
    // An event you are attending is starting soon
    // An event you are attending has been cancelled
    // An event you are attending has been rescheduled
    // An event you are attending had its location changed

    destination: String, // 'None', 'Group', 'Chat', 'Event', 'Student'
    payload: String, // group_id, chat_id, event_id, student_id

    receiver: String, // student_id
}, { timestamps: true, collection: 'pack_notification' })

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification