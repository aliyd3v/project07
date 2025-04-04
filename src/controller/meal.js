import AppError from '../utils/appError.js'
import pg from '../database/postgresql.js'
import storage from "../helper/storage.js"
import fs from 'node:fs'
import { createMealSchema, fileSchema, updateMealSchema } from "../utils/validateSchemas.js"

const mealController = {
    createOne: async (req, res, next) => {
        const { body } = req
        try {
            const { error } = createMealSchema.validate(body)
            if (error) {
                req.file ? fs.unlinkSync(req.file.path) : false
                return next(
                    new AppError(400, 'fail', error.details[0].message),
                    req,
                    res,
                    next
                )
            }
            if (req.file) {
                const { error } = fileSchema.validate(req.file)
                if (error) {
                    fs.unlinkSync(req.file.path)
                    return next(
                        new AppError(
                            400,
                            'fail',
                            error.details[0].message
                        ),
                        req,
                        res,
                        next
                    )
                }
            }
            const condidat = await pg.query(
                `SELECT id, name FROM meals WHERE name = $1;`,
                [body.name]
            )
            if (condidat.rowCount) {
                req.file ? fs.unlinkSync(req.file.path) : false
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
                req.file ? fs.unlinkSync(req.file.path) : false
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
            let imageUrl = null
            if (req.file) {
                const { errUpload, data } = await storage.upload(req.file.filename, req.file.path)
                if (errUpload) {
                    fs.unlinkSync(req.file.path)
                    return next(
                        new AppError(500, 'fail', 'Uploading is failed! Please try again later.'),
                        req,
                        res,
                        next
                    )
                }
                imageUrl = data.publicUrl
            }
            const insertQuery = req.file ? `INSERT INTO meals
(name, price, category_id, active, image_url, image_name)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id, 
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, image_url, created_at;`
                : `INSERT INTO meals
(name, price, category_id, active)
VALUES($1, $2, $3, $4)
RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id, 
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, created_at;`
            const values = req.file ? [
                body.name,
                body.price,
                body.category_id,
                body.active == 1 ? true : false,
                imageUrl,
                req.file.filename
            ] : [
                body.name,
                body.price,
                body.category_id,
                body.active == 1 ? true : false
            ]
            const meal = await pg.query(insertQuery, values)
            req.file ? fs.unlinkSync(req.file.path) : false
            if (meal.rows[0].active == true) {
                
            }
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
                `SELECT meals.id, meals.name, meals.price, meals.image_url,
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
                `SELECT meals.id, meals.name, meals.price, meals.image_url,
meals.category_id, categories.name AS category_name, meals.active, meals.created_at, meals.updated_at
FROM meals
JOIN categories ON meals.category_id = categories.id
ORDER BY meals.name ASC;`
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
                req.file ? fs.unlinkSync(req.file.path) : false
                return next(
                    new AppError(404, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            if (req.file) {
                const { error } = fileSchema.validate(req.file)
                if (error) {
                    fs.unlinkSync(req.file.path)
                    return next(
                        new AppError(
                            400,
                            'fail',
                            error.details[0].message
                        ),
                        req,
                        res,
                        next
                    )
                }
            }
            const meal = await pg.query(`SELECT id FROM meals WHERE id = $1;`, [id])
            if (!meal.rowCount) {
                req.file ? fs.unlinkSync(req.file.path) : false
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            if (meal.category != body.category_id) {
                const category = await pg.query(
                    `SELECT id, name FROM categories WHERE id = $1;`,
                    [body.category_id]
                )
                if (!category.rowCount) {
                    req.file ? fs.unlinkSync(req.file.path) : false
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
            }
            let imageUrl = null
            if (req.file) {
                await storage.delete(meal.rows[0].file_name)
                const { errUpload, data } = await storage.upload(req.file.filename, req.file.path)
                if (errUpload) {
                    fs.unlinkSync(req.file.path)
                    return next(
                        new AppError(500, 'fail', 'Uploading is failed! Please try again later.'),
                        req,
                        res,
                        next
                    )
                }
                imageUrl = data.publicUrl
            }
            const updateQuery = req.file ? `UPDATE meals
SET name = $1, price = $2, category_id = $3, active = $4, 
image_url = $5, image_name = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $7 RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id,
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, image_url, created_at, updated_at;`
                : `UPDATE meals
SET name = $1, price = $2, category_id = $3, active = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $5
RETURNING id, name, price,
JSON_BUILD_OBJECT(
'id', category_id,
'name', (SELECT name FROM categories WHERE id = category_id)) AS category,
active, image_url, created_at, updated_at;`
            const values = req.file ? [
                body.name,
                body.price,
                body.category_id,
                body.active == 1 ? true : false,
                imageUrl,
                req.file.filename,
                id
            ] : [
                body.name,
                body.price,
                body.category_id,
                body.active == 1 ? true : false,
                id
            ]
            const updatedMeal = await pg.query(updateQuery, values)
            req.file ? fs.unlinkSync(req.file.path) : false
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
            await storage.delete(meal.rows[0].image_name)
            const deleteQuery = `DELETE FROM meals WHERE id = $1;`
            const values = [id]
            await pg.query(deleteQuery, values)
            res.status(200).json({
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
            const meal = await pg.query(`SELECT id, active FROM meals WHERE id = $1;`, [id])
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
active, image_url, created_at, updated_at;`
            const values = [!meal.rows[0].active, id]
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