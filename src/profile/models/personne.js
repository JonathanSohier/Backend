const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
        required: true,
    },
});

module.exports = Company = Profile.discriminator('Personnes', personSchema)