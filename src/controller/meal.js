import { createMealSchema, updateMealSchema } from "../utils/validateSchemas.js"
import AppError from '../utils/appError.js'
import pg from '../database/postgresql.js'
import storage from "../helper/storage.js"
import fs from 'node:fs'

const mealController = {
    createOne: async (req, res, next) => {
        const { body } = req
        try {
            console.log(req.file)
            const filePath = req.file.path
            const fileName = req.file.filename
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
                `SELECT id, name FROM categories WHERE id = $1;`,
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


            // storage


            // storage.getUrl


            const insertQuery = `INSERT INTO meals (name, price, category_id, active)
VALUES($1, $2, $3, $4)
RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id,
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, created_at;`
            const values = [body.name, body.price, body.category_id, body.active]
            const meal = await pg.query(insertQuery, values)
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
    updateOne: async (req, res, next) => {
        const { params: { id }, body } = req
        try {
            const validationResult = updateMealSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(404, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const meal = await pg.query(`SELECT id FROM meals WHERE id = $1;`, [id])
            if (!meal.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }


            // storage.upload


            // storage.getUrl


            const updateQuery = `UPDATE meals
SET name = $1, price = $2, category_id = $3, active = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $5
RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id,
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, created_at, updated_at;`
            const values = [body.name, body.price, body.category_id, body.active, id]
            const updatedMeal = await pg.query(updateQuery, values)
            res.status(200).json({
                status: 'success',
                data: {
                    meal: updatedMeal.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    deleteOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const meal = await pg.query(
                `SELECT id FROM meals WHERE id = $1;`,
                [id]
            )
            if (!meal.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            const deleteQuery = `DELETE meals WHERE id = $1;`
            const values = [id]
            await pg.query(deleteQuery, values)
            res.status(204).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    },
    changeActive: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const meal = await pg.query(`SELECT id FROM meals WHERE id = $1;`, [id])
            if (!meal.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            const updateQuery = `UPDATE meals
SET active = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id,
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, created_at, updated_at;`
            const values = [meal.active === true ? false : true, id]
            const updatedMeal = await pg.query(updateQuery, values)
            res.status(200).json({
                status: 'success',
                data: {
                    meal: updatedMeal.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

export default mealController