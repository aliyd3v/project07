import { createMealSchema } from "../utils/validateSchemas.js"
import AppError from '../utils/appError.js'
import pg from '../database/postgresql.js'

const mealController = {
    createOne: async (req, res, next) => {
        const { body } = req
        try {
            const validateResult = createMealSchema.validate(body)
            if (validateResult.error) {
                return next(
                    new AppError(400, 'fail', validateResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const condidat = await pg.query(
                `SELECT id, name FROM meals WHERE name = $1;`,
                [body.name]
            )
            if (condidat.rowCount) {
                return next(
                    new AppError(
                        400,
                        'fail',
                        `The chosen meal name '${body.name}' is already taken. Please try a different one.`
                    ),
                    req,
                    res,
                    next
                )
            }
            const category = await pg.query(
                `SELECT id, name FROM categories WHERE id = $1 AND active = true;`,
                [body.category_id]
            )
            if (!category.rowCount) {
                return next(
                    new AppError(
                        400,
                        'fail',
                        `No document found with that category_id.`
                    ),
                    req,
                    res,
                    next
                )
            }
            const insertQuery = `INSERT INTO meals (name, price, category_id) VALUES($1, $2, $3);`
            const values = [body.name, body.price, body.category_id]
            await pg.query(insertQuery, values)
            const meal = await pg.query(
                `SELECT meals.id, meals.name, meals.price,
                categories.name AS category_name,
                meals.created_at
                FROM meals
                JOIN categories ON meals.category_id = categories.id
                WHERE name = $1`,
                [body.name]
            )
            res.status(201).json({
                status: 'success',
                data: {
                    meal: meal.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const meal = await pg.query(
                `SELECT meals.id, meals.name, meals.price,
                categories.name AS category_name,
                meals.created_at, meals.updated_at
                FROM meals
                JOIN categories ON meals.category_id = categories.id
                WHERE meals.id = $1 AND meals.active = true;`,
                [id]
            )
            if (!meal.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that category_id.`),
                    req,
                    res,
                    next
                )
            }
            res.status(200).json({
                status: 'success',
                data: {
                    meal: meal.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const meals = await pg.query(
                `SELECT meals.id, meals.name, meals.price, categories.name AS category_name, meals.created_at, meals.updated_at
                FROM meals
                JOIN categories ON meals.category_id = categories.id
                WHERE meals.active = true;`
            )
            res.status(200).json({
                status: 'success',
                data: {
                    meals: meals.rows
                }
            })
        } catch (error) {
            next(error)
        }
    },
    updateOne: async (req, res, next) => { },
    deleteOne: async (req, res, next) => { }
}

export default mealController