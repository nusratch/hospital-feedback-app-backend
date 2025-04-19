const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sentiment Analysis Schemas
const vaderSentimentSchema = new Schema({
  negative: { type: Number, required: true },
  neutral: { type: Number, required: true },
  positive: { type: Number, required: true },
  compound: { type: Number, required: true }
}, { _id: false });

const textblobSentimentSchema = new Schema({
  polarity: { type: Number, required: true },
  subjectivity: { type: Number, required: true }
}, { _id: false });

const commentSentimentSchema = new Schema({
  vader: { type: vaderSentimentSchema, required: true },
  textblob: { type: textblobSentimentSchema, required: true }
}, { _id: false });

// Original Feedback Schema
const originalFeedbackSchema = new Schema({
  feedbackType: { 
    type: String, 
    enum: ['positive', 'negative', 'neutral'],
    required: true 
  },
  confidence: { 
    type: Number, 
    required: true,
    min: 0,
    max: 1
  },
  problematicFields: [{
    type: String,
    enum: [
      'doctorBehavior',
      'nursingStaff',
      'waitingTime',
      'cleanliness',
      'foodQuality',
      'medicationAvailability',
      'registrationProcess',
      'hospitalFacilities',
      'costOfTreatment',
      'overallExperience'
    ]
  }],
  averageRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentSentiment: { 
    type: commentSentimentSchema, 
    required: true 
  }
}, { _id: false });

// Notification Schema
const notificationSchema = new Schema({
  authority: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    required: true
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: String
  }
}, { _id: false });

// DMSS Data Schema
const dmssDataSchema = new Schema({
  originalFeedback: {
    type: originalFeedbackSchema,
    required: true
  },
  systemResponse: {
    type: String,
    required: true
  },
  notificationsSent: [notificationSchema],
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  resolutionNotes: {
    type: String
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: String
  }
}, { _id: false });

// Main Feedback Schema
const feedbackReqSchema = new Schema({
    uid: {
        type: String,
        index: true,
    },

    feedback: [
        {
            _id: false,
            hospitalToken: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 20
            },

            additionalComments: {
                type: String,
                default: '',
                maxlength: 500
            },

            ratings: {
                doctorBehavior: { type: Number, required: true, min: 1, max: 5 },
                nursingStaff: { type: Number, required: true, min: 1, max: 5 },
                waitingTime: { type: Number, required: true, min: 1, max: 5 },
                cleanliness: { type: Number, required: true, min: 1, max: 5 },
                foodQuality: { type: Number, required: true, min: 1, max: 5 },
                medicationAvailability: { type: Number, required: true, min: 1, max: 5 },
                registrationProcess: { type: Number, required: true, min: 1, max: 5 },
                hospitalFacilities: { type: Number, required: true, min: 1, max: 5 },
                costOfTreatment: { type: Number, required: true, min: 1, max: 5 },
                overallExperience: { type: Number, required: true, min: 1, max: 5 },
                averageRating: { type: Number, required: true, min: 1, max: 5, },
            },

            // Updated dssmData with proper schema
            dssmData: {
                type: dmssDataSchema,
                default: null
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