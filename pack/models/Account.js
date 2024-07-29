const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const accountSchema = new Schema({
    _id: {
        type: String,
        default: () => `Account-${new mongoose.Types.ObjectId()}`,
    },

    email: String,
    password: String,
    student: String, // student_id

    location: [Number], // [latitude, longitude]

    autoToken: String,
    pushToken: String,
}, { timestamps: true, collection: 'pack_account' })

accountSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const Account = mongoose.model('Account', accountSchema);

module.exports = Account