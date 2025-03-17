import pg from "../database/postgresql.js"
import AppError from "../utils/appError.js"
import { createCategorySchema, updateCategorySchema } from "../utils/validateSchemas.js"

const categoryController = {
    createOne: async (req, res, next) => {
        const { name } = req.body
        try {
            const validationResult = createCategorySchema.validate({ name })
            if (validationResult.error) {
                return next(
                    new AppError(400, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const condidat = await pg.query(
                `SELECT id, name FROM categories WHERE name = $1`,
                [name]
            )
            if (condidat.rowCount) {
                return next(
                    new AppError(
                        400,
                        'fail',
                        `The chosen name '${name}' is already taken. Please try a different one.`
                    ),
                    req,
                    res,
                    next
                )
            }
            const insertQuery = `INSERT INTO categories(name) VALUES($1)`
            const values = [name]
            await pg.query(insertQuery, values)
            const category = await pg.query(`SELECT id, name, created_at, updated_ad FROM categories WHERE name = $1;`, [name])
            res.status(201).json({
                status: 'success',
                data: {
                    category: category.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const selectQuery = `SELECT id, name, created_at, updated_ad FROM categories WHERE id = $1 AND active = true;`
            const values = [id]
            const category = await pg.query(selectQuery, values)
            if (!category.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            res.status(200).json({
                status: 'success',
                data: {
                    category: category.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const categories = await pg.query(
                `SELECT id, name, created_at, updated_ad FROM categories WHERE active = true ORDER BY name ASC;`
            )
            res.status(200).json({
                status: 'success',
                data: {
                    categories: categories.rows
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getCategoriesWithMeals: async (req, res, next) => {
        try {
            const selectQuery = `SELECT 
            c.id AS category_id, 
            c.name AS category_name, 
            COALESCE(JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', m.id, 
                    'name', m.name, 
                    'price', m.price
                )
            ) FILTER (WHERE m.id IS NOT NULL), '[]') AS meals
            FROM categories c
            LEFT JOIN meals m ON c.id = m.category_id
            WHERE c.active = true
            GROUP BY c.id, c.name
            ORDER BY c.name;`
            const categories = await pg.query(selectQuery)
            res.status(200).json({
                status: 'success',
                data: {
                    categories: categories.rows
                }
            })
        } catch (error) {
            next(error)
        }
    },
    updateOne: async (req, res, next) => {
        const { params: { id }, body } = req
        try {
            const validationResult = updateCategorySchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const category = await pg.query(
                `SELECT id, name FROM categories WHERE id = $1 AND active = true;`,
                [id]
            )
            if (!category.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            const condidat = await pg.query(
                `SELECT id, name FROM categories WHERE name = $1;`,
                [body.name]
            )
            if (condidat.rowCount && condidat.rows[0].id != id) {
                return next(
                    new AppError(
                        400,
                        'fail',
                        `The chosen name '${body.name}' is already taken. Please try a different one.`
                    ),
                    req,
                    res,
                    next
                )
            }
            await pg.query(
                `UPDATE categories
                SET name = $1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $2 AND active = true;`,
                [body.name, id]
            )
            const updatedCategory = await pg.query(
                `SELECT id, name, created_at, updated_ad FROM categories WHERE id = $1;`,
                [id]
            )
            res.status(201).json({
                status: 'success',
                data: {
                    category: updatedCategory.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    deleteOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const category = await pg.query(`SELECT id, name FROM categories
                WHERE id = $1 AND active = true`, [id])
            if (!category.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            const updateQuery = `UPDATE categories
            SET active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1`
            const values = [id]
            await pg.query(updateQuery, values)
            res.status(200).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default categoryController