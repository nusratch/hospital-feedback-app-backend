const mongoose = require('mongoose');

const otpDataSchema = new mongoose.Schema({
    countryCode: {
        type: String,
        maxlength: 3,
    },
    otp: {
        type: String,
        minlength: 4,
        maxlength: 6,
        match: /^[0-9]+$/
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

const authoritySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: [],
    otpData: otpDataSchema,
}, {
    timestamps: true
});

// Index for faster querying
authoritySchema.index({ email: 1 }, { unique: true });

const Authority = mongoose.model('authorities', authoritySchema);

module.exports = Authority;
