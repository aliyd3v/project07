import Joi from 'joi'

export const loginSchema = Joi.object({
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
        .pattern(new RegExp('^[a-zA-Z0-9]{5,32}$'))
        .message('Password must be between 5 and 32 characters long and contain only letters and numbers.')
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
        .message('Password must be between 5 and 32 characters long and contain only letters and numbers.')
        .required()
})

export const createCategorySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .message('Name must be min 2 charakters!')
        .max(128)
        .message('Name must be max 128 charakters!')
        .required()
})

export const updateCategorySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .message('Name must be min 2 charakters!')
        .max(128)
        .message('Name must be max 128 charakters!')
        .required()
})

export const createMealSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .message('Meal name must be min 2 charakters!')
        .max(128)
        .message('Meal name must be max 128 charakters!')
        .required(),

    price: Joi.number()
        .required(),

    category_id: Joi.number()
        .required()
})

// export const updateMealSchema = Joi.object({
//     name: Joi.string()
//         .min(2)
//         .message('Meal name must be min 2 charakters!')
//         .max(128)
//         .message('Meal name must be max 128 charakters!')
//         .required(),

//     price: Joi.number()
//         .required(),

//     category_id: Joi.number()
//         .required()
// })