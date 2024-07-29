const mongoose = require('mongoose')
const Schema = mongoose.Schema

const traitSchema = new Schema({
    _id: {
        type: String,
        default: () => `Trait-${new mongoose.Types.ObjectId()}`,
    },

    name: String,
    photo: String,
    description: String,

    globalPopulation: Number,
}, { timestamps: true, collection: 'pack_trait' })

const Trait = mongoose.model('Trait', traitSchema);

module.exports = Trait