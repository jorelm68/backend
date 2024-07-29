const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const codeSchema = new Schema({
    _id: {
        type: String,
        default: () => `Code-${new mongoose.Types.ObjectId()}`,
    },

    email: String,
    code: Number,
    expiration: Date,
}, { timestamps: true, collection: 'pack_code' })

const Code = mongoose.model('Code', codeSchema);

module.exports = Code