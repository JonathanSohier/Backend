const mongoose = require('mongoose');
const {uuid, jsonSchema} = require('uuidv4');

const postSchema = new mongoose.Schema({
    commentCount: {
        type: Number,
        default: 0,
    },
    id: {
        index: true,
        type: jsonSchema.v4.type,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
});

postSchema.pre('save', function (next) {
    this.id = uuid();
    next();
});

module.exports = Post = mongoose.model('Post', postSchema)