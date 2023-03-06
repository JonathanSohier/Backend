const mongoose = require('mongoose');
const {uuid, jsonSchema} = require('uuidv4');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    id: {
        type: jsonSchema.v4.type,
        unique: true,
    },
    post: {
        type:jsonSchema.v4.type,
        ref: 'Post',
    }
});

commentSchema.pre('save', function (next) {
    this.id = uuid();
    next();
});

module.exports = Comment = mongoose.model('Comment', commentSchema)