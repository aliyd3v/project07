import { createTableSchema } from "../utils/validateSchemas.js"
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
                        `The chosen table number '${body.number}' is already taken. Please try a different one.`
                    ),
                    req,
                    res,
                    next
                )
            }
            const insertQuery = `INSERT INTO tables (number)
VALUES ($1)
RETURNING id, number, active, created_at;`
            const values = [body.number]
            const table = await pg.query(insertQuery, values)
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
    }
}

export default tableController