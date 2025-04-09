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
        .pattern(new RegExp('^[a-zA-Z0-9]{5,32}$'))
        .message('Password must be between 5 and 32 characters long and contain only letters and numbers.')
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
        .required(),

    active: Joi.number()
        .valid(0, 1)
        .required()
})

export const updateCategorySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .message('Name must be min 2 charakters!')
        .max(128)
        .message('Name must be max 128 charakters!')
        .required(),

    active: Joi.number()
        .valid(0, 1)
        .required()
})

export const fileSchema = Joi.object({
    originalname: Joi.string().regex(/\.(jpg|jpeg|png|gif)$/i).required(),

    mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/gif")
        .required(),

    size: Joi.number().max(2 * 1024 * 1024).required(),

    fieldname: Joi.string()
        .valid('image')
        .required(),

    encoding: Joi.string(),

    destination: Joi.string()
        .valid('tmp/')
        .required(),

    filename: Joi.string(),

    path: Joi.string()
});

export const createMealSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .message('Meal name must be min 2 charakters!')
        .max(128)
        .message('Meal name must be max 128 charakters!')
        .required(),

    price: Joi.number()
        .integer()
        .min(1)
        .message('Price cannot be less from 1!')
        .required(),

    category_id: Joi.number()
        .integer()
        .min(1)
        .message('Category id cannot be less from 1!')
        .required(),

    is_ready_product: Joi.number()
        .valid(0, 1)
        .required(),

    active: Joi.number()
        .valid(0, 1)
        .required()
})

export const updateMealSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .message('Meal name must be min 2 charakters!')
        .max(128)
        .message('Meal name must be max 128 charakters!')
        .required(),

    price: Joi.number()
        .integer()
        .min(1)
        .message('Price cannot be less from 1!')
        .required(),

    category_id: Joi.number()
        .integer()
        .min(1)
        .message('Category id cannot be less from 1!')
        .required(),

    is_ready_product: Joi.number()
        .valid(0, 1)
        .required(),

    active: Joi.number()
        .valid(0, 1)
        .required()
})

export const createTableSchema = Joi.object({
    number: Joi.number()
        .integer()
        .min(1)
        .message('Table number cannot be less from 1!')
        .required()
})

const orderItemsSchema = Joi.object({
    mealId: Joi.number()
        .integer()
        .min(1)
        .required(),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
})

export const createOrderSchema = Joi.object({
    table_id: Joi.number()
        .integer()
        .min(1)
        .message('Table id cannot be less from 1!')
        .required(),

    // status: Joi.string()
    //     .valid('Pending', 'Preparing', 'Prepared', 'Canceled')
    //     .required(),

    // service_staff_id: Joi.number()
    //     .integer()
    //     .min(1)
    //     .message('Service staff id cannot be less from 1!')
    //     .required(),

    meals: Joi.array()
        .items(orderItemsSchema)
        .min(1)
        .required()
})