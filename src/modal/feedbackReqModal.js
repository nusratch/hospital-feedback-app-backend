const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const feedbackReqSchema = new Schema({
    uid: {
        type: String,
        index: true,
    },

    feedback: [
        {
            _id: false,
            userToken: {
                type: String,
                index: true,
            },
            message: {
                type: String,
                index: false,

            },
            typePositive: {
                type: String,
                index: false,
                default: '',
                enum: ['', 'positive', 'negative'],
            },
        }
    ],

    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });



const feedbackReqModal = mongoose.model('feedback', feedbackReqSchema);

module.exports = feedbackReqModal;