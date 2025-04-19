const Joi = require("joi")

const feedback = (req, res, next) => {
    const { body, query } = req

    const feedbackSchema = Joi.object({
        uid: Joi.string().required(), // Assuming a 24-character unique ID
        // name: Joi.string().min(2).max(50).required(),
        // email: Joi.string().email().required(),
        // phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(), // Ensuring a 10-digit phone number
        hospitalToken: Joi.string().min(3).max(20).required(),
        ratings: Joi.object({
            doctorBehavior: Joi.number().integer().min(1).max(5).required(),
            nursingStaff: Joi.number().integer().min(1).max(5).required(),
            waitingTime: Joi.number().integer().min(1).max(5).required(),
            cleanliness: Joi.number().integer().min(1).max(5).required(),
            foodQuality: Joi.number().integer().min(1).max(5).required(),
            medicationAvailability: Joi.number().integer().min(1).max(5).required(),
            registrationProcess: Joi.number().integer().min(1).max(5).required(),
            hospitalFacilities: Joi.number().integer().min(1).max(5).required(),
            costOfTreatment: Joi.number().integer().min(1).max(5).required(),
            overallExperience: Joi.number().integer().min(1).max(5).required(),
            additionalComments: Joi.string().allow('').max(500), // Optional, max 500 characters
            averageRating: Joi.number().min(1).max(5).precision(1).required(), // 1 decimal place allowed
        }).required(),
    });

    try {
        const { error, value } = feedbackSchema.validate(body);
        if (error) {
            res.status(400).send({ message: error.message })
            return;
        }
        req.locals = { value }
        next();
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(ErrorCodes[500])
    }
}

const feedbackList = (req, res, next) => {
    const { params, query } = req

    const schema = Joi.object({
        uid: Joi.string().required(),
    });

    try {
        const { error, value } = schema.validate(params);
        if (error) {
            res.status(400).send({ message: error.message })
            return;
        }
        req.locals = { value }
        next();
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(ErrorCodes[500])
    }
}

module.exports = { feedback, feedbackList }