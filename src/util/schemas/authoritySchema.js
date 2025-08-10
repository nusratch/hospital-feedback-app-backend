const Joi = require('joi');

const createAuthoritySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    phoneNumber: Joi.optional(),
    department: Joi.string().required().messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required'
    }),
    role:Joi.array().required(),
    createdBy: Joi.string()
});

const updateAuthoritySchema = Joi.object({
    name: Joi.string().messages({
        'string.empty': 'Name cannot be empty'
    }),
    email: Joi.string().email().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email cannot be empty'
    }),
    phoneNumber: Joi.optional(),
    department: Joi.string().messages({
        'string.empty': 'Department cannot be empty'
    }),
    role:Joi.array().required(),

    updatedBy: Joi.string()

}).min(1);

module.exports = {
    createAuthoritySchema,
    updateAuthoritySchema
};
