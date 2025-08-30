const mongoose = require('mongoose');

const hospitalTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 6
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Authority',
        required: true
    }
}, {
    timestamps: true
});

// Index for faster querying
hospitalTokenSchema.index({ token: 1 }, { unique: true });

const HospitalToken = mongoose.model('hospitalToken', hospitalTokenSchema);

module.exports = HospitalToken;
