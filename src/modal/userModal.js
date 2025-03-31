const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
        index: true
    },
    countryCode: {
        type: String,
        length: 3,
    },
    phoneNumber: {
        type: [Number, null],
        length: 10,
        match: /[1-9]/,
        index: true,
    },
    password: {
        type: Object
    },
    email: {
        type: String,
        index: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });



const userModal = mongoose.model('user', userSchema);

module.exports = userModal;