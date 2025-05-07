import pg from '../database/postgresql.js'
import PassController from '../helper/scrypt.js'
import AppError from '../utils/appError.js'
import { createUserSchema, updateUserSchema } from '../utils/validateSchemas.js'

const userController = {
    createOne: async (req, res, next) => {
        const { body } = req
        try {
            const validationResult = createUserSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'failed', validationResult.error.message),
                    req,
                    res,
                    next)
            }
            const condidat = await pg.query(
                'SELECT id, username FROM users WHERE username = $1;', [body.username]
            )
            if (condidat.rowCount) {
                return next(
                    new AppError(
                        400,
                        'fail',
                        `The chosen username '${body.username}' is already taken. Please try a different one.`
                    ),
                    req,
                    res,
                    next)
            }

            const password = await PassController.hash(body.password)
            body.password = undefined

            const insertQuery = `INSERT INTO 
users(name, username, password, gender, role) 
VALUES($1, $2, $3, $4, $5)
RETURNING id, name, username, gender, role, created_at;`
            const values = [body.name, body.username, password, body.gender, body.role]
            const user = await pg.query(
                insertQuery,
                values
            )
            res.status(201).json({
                status: 'success',
                data: {
                    user: user.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const selectQuery = `SELECT 
            id, name, username, gender, role, created_at, updated_at 
            FROM users WHERE id = $1 AND active = true;`
            const values = [id]
            const user = await pg.query(selectQuery, values)
            if (!user.rowCount) {
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
                    user: user.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const selectQuery = `SELECT
            id, name, username, gender, role, created_at, updated_at
            FROM users WHERE active = true ORDER BY username ASC;`
            const users = await pg.query(selectQuery)
            res.status(200).json({
                status: 'success',
                data: {
                    users: users.rows
                }
            })
        } catch (error) {
            next(error)
        }
    },
    updateOne: async (req, res, next) => {
        const { params: { id }, body } = req
        try {
            const validationResult = updateUserSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'failed', validationResult.error.message),
                    req,
                    res,
                    next)
            }
            const selectQuery = `SELECT id, username FROM users WHERE id = $1 AND active = true;`
            const selectValues = [id]
            const user = await pg.query(selectQuery, selectValues)
            if (!user.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            if (user.rows[0].username != body.username) {
                const condidat = await pg.query(
                    'SELECT id, username FROM users WHERE username = $1',
                    [body.username]
                )
                if (condidat.rowCount) {
                    return next(
                        new AppError(
                            400,
                            'fail',
                            `The chosen username '${body.username}' is already taken. Please try a different one.`
                        ),
                        req,
                        res,
                        next
                    )
                }
            }
            const updatedUser = await pg.query(
                `UPDATE users
SET name = $1, username = $2, gender = $3, role = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $5 AND active = true
RETURNING id, name, username, gender, role, created_at, updated_at;`,
                [body.name, body.username, body.gender, body.role, id]
            )
            res.status(200).json({
                status: 'success',
                data: {
                    user: updatedUser.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    deleteOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const user = await pg.query(`SELECT id, name FROM users
                WHERE id = $1 AND active = true`, [id])
            if (!user.rowCount) {
                return next(
                    new AppError(404, 'fail', 'No document found with that id.'),
                    req,
                    res,
                    next
                )
            }
            await pg.query(`DELETE FROM users WHERE id = $1;`, [id])
            res.status(200).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    },
    checkUser: async (req, res, next) => {
        try {
            res.status(200).json({
                status: 'success',
                user: {
                    role: req.user.role
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

export default userController