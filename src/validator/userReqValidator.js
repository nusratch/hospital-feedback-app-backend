const Joi = require("joi")

const getUserValidator = (req, res, next) => {
    const { params, query } = req
    console.log("::::::", query)

    const schema = Joi.object({
        uid: Joi.string().required()
    })

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

const creatUserValidator = (req, res, next) => {
    const { body } = req

    // const schema = Joi.object({
    //     id: Joi.number().required()
    // })

    try {
        //     const { error, value } = schema.validate(params);
        //     if (error) {
        //         res.status(400).send({ message: error.message })
        //         return;
        //  
        req.locals = { value: body }
        next();
    }
    catch (err) {
        return res.status(500).send(ErrorCodes[500])
    }
}

const userLoginValidator = (req, res, next) => {
    const { body } = req

    // const schema = Joi.object({
    //     id: Joi.number().required()
    // })

    try {
        //     const { error, value } = schema.validate(params);
        //     if (error) {
        //         res.status(400).send({ message: error.message })
        //         return;
        //     
        req.locals = { value: body }
        next();
    }
    catch (err) {
        return res.status(500).send(ErrorCodes[500])
    }
}

const signUpValidator = (req, res, next) => {
    const { body } = req

    // const schema = Joi.object({
    //     id: Joi.number().required()
    // })

    try {
        //     const { error, value } = schema.validate(params);
        //     if (error) {
        //         res.status(400).send({ message: error.message })
        //         return;
        //     
        req.locals = { value: body }
        next();
    }
    catch (err) {
        return res.status(500).send(ErrorCodes[500])
    }
}

const verifyOtpValidator = (req, res, next) => {
    const { body } = req

    // const schema = Joi.object({
    //     id: Joi.number().required()
    // })

    try {
        //     const { error, value } = schema.validate(params);
        //     if (error) {
        //         res.status(400).send({ message: error.message })
        //         return;
        //     
        req.locals = { value: body }
        next();
    }
    catch (err) {
        return res.status(500).send(ErrorCodes[500])
    }
}

const updateUserValidator = (req, res, next) => {
    const { body } = req

    // const schema = Joi.object({
    //     id: Joi.number().required()
    // })

    try {
        //     const { error, value } = schema.validate(params);
        //     if (error) {
        //         res.status(400).send({ message: error.message })
        //         return;
        //     
        req.locals = { value: body, uid: req.params.id }
        next();
    }
    catch (err) {
        return res.status(500).send(ErrorCodes[500])
    }
}

const searchUserValidator = (req, res, next) => {
    const { body } = req

    // const schema = Joi.object({
    //     id: Joi.number().required()
    // })

    try {
        //     const { error, value } = schema.validate(params);
        //     if (error) {
        //         res.status(400).send({ message: error.message })
        //         return;
        //   
        req.locals = { value: body.searchText }
        next();
    }
    catch (err) {
        return res.status(500).send(ErrorCodes[500])
    }
}

module.exports = { getUserValidator, creatUserValidator, userLoginValidator, signUpValidator, verifyOtpValidator, updateUserValidator, searchUserValidator }