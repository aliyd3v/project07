import { createTableSchema, updateTableSchema } from "../utils/validateSchemas.js"
import AppError from '../utils/appError.js'
import pg from '../database/postgresql.js'

const tableController = {
    createOne: async (req, res, next) => {
        const { body } = req
        try {
            const validationResult = createTableSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const condidat = await pg.query(
                `SELECT id, number FROM tables WHERE number = $1;`,
                [body.number]
            )
            if (condidat.rowCount) {
                return next(
                    new AppError(
                        400,
                        'fail',
                        `The chosen table number '${body.number}' is already taken. Please try a different number.`
                    ),
                    req,
                    res,
                    next
                )
            }
            const table = await pg.query(
                `INSERT INTO tables (number)
VALUES ($1)
RETURNING id, number, active, created_at;`,
                [body.number]
            )
            res.status(201).json({
                status: 'success',
                data: {
                    table: table.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const selectQuery = `SELECT id, number, active, created_at, updated_at
FROM tables ORDER BY number;`
            const tables = await pg.query(selectQuery)
            res.status(200).json({
                status: 'success',
                data: {
                    tables: tables.rows
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const table = await pg.query(
                `SELECT id, number, active, created_at, updated_at FROM tables WHERE id = $1;`,
                [id]
            )
            if (!table.rowCount) {
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
                    table: table.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    updateOne: async (req, res, next) => {
        const { body, params: { id } } = req
        try {
            const validationResult = updateTableSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const table = await pg.query(
                `SELECT id, number, active, created_at, updated_at FROM tables WHERE id = $1;`,
                [id]
            )
            if (!table.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            if (table.rows[0].number != body.number) {
                const condidat = await pg.query(
                    `SELECT id FROM tables WHERE number = $1;`,
                    [body.number]
                )
                if (condidat.rowCount) {
                    return next(
                        new AppError(
                            400,
                            'fail',
                            `The chosen table number '${body.number}' is already taken. Please try a different number.`
                        ),
                        req,
                        res,
                        next
                    )
                }
                const updatedTable = await pg.query(
                    `UPDATE tables
SET number = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, number, active, created_at, updated_at;`,
                    [body.number, id]
                )
                res.status(200).json({
                    status: 'success',
                    data: {
                        table: updatedTable.rows[0]
                    }
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    data: {
                        table: table.rows[0]
                    }
                })
            }
        } catch (error) {
            next(error)
        }
    },
    deleteOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const table = await pg.query(
                `SELECT id FROM tables WHERE id = $1;`,
                [id]
            )
            if (!table.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            await pg.query(`DELETE FROM tables WHERE id = $1;`, [id])
            res.status(200).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default tableController