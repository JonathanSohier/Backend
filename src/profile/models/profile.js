const mongoose = require('mongoose');
const { uuid, jsonSchema } = require('uuidv4');

const profileSchema = new mongoose.Schema({
    id: {
        index: true,
        type: jsonSchema.v4.type,
    },
    Username: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    Avatar: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },     
    },{discriminatorKey: "kind"});

module.exports = Profile = mongoose.model('Profile', profileSchema);

