const mongoose = require('mongoose');
const { uuid, jsonSchema } = require('uuidv4');
const Profile = require('./profile');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = Company = Profile.discriminator('Company', companySchema)