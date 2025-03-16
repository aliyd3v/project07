import Joi from 'joi'

export const loginSchema = Joi.object({
    username: Joi.string()
        .trim()
        .message('Username must be trim!')
        .min(3)
        .message('Username must be min 3 charakters!')
        .max(32)
        .message('Username must be max 64 charakters!'),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,32}$'))
        .required()
})

export const createUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .message('Name must be min 3 charakters!')
        .max(64)
        .message('Name must be max 64 charakters!')
        .required(),

    username: Joi.string()
        .trim()
        .message('Username must be trim!')
        .min(3)
        .message('Username must be min 3 charakters!')
        .max(32)
        .message('Username must be max 64 charakters!')
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,32}$'))
        .required(),

    gender: Joi.string()
        .valid('Male', 'Female')
        .required(),

    role: Joi.string()
        .valid('Waiter', 'Waitress', 'Chef', 'Cook', 'Admin')
        .required()
})

export const updateUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .message('Name must be min 3 charakters!')
        .max(64)
        .message('Name must be max 64 charakters!')
        .required(),

    username: Joi.string()
        .trim()
        .message('Username must be trim!')
        .min(3)
        .message('Username must be min 3 charakters!')
        .max(32)
        .message('Username must be max 64 charakters!')
        .required(),

    gender: Joi.string()
        .valid('Male', 'Female')
        .required(),

    role: Joi.string()
        .valid('Waiter', 'Waitress', 'Chef', 'Cook', 'Admin')
        .required()
})

export const updatePasswordSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,32}$'))
        .required()
})