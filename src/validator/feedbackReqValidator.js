const Joi = require("joi")

const feedback = (req, res, next) => {
    const { body, query } = req

    const schema = Joi.object({
        uid: Joi.string().required(),
        message: Joi.string().required(),
        userToken: Joi.string().length(6).required()
    });

    try {
        const { error, value } = schema.validate(body);
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