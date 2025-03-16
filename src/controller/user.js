import pg from '../database/postgresql.js'
import AppError from '../utils/appError.js'
import { createUserSchema, updatePasswordSchema } from '../utils/validateSchemas.js'

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
                'SELECT * FROM users WHERE username = $1;', [body.username]
            )
            if (condidat.rowCount) {
                return next(
                    new AppError(400, 'fail', `Username '${body.username}' is already used!`),
                    req,
                    res,
                    next)
            }

            const insertQuery = 'INSERT INTO users(name, username, password, gender, role) VALUES($1, $2, $3, $4, $5);'
            const values = [body.name, body.username, body.password, body.gender, body.role]
            await pg.query(
                insertQuery,
                values
            )
            const newUser = await pg.query(
                'select id, name, username, gender, role, points, created_at from users where username = $1',
                [body.username]
            )

            return res.status(201).json({
                status: 'success',
                data: {
                    user: newUser.rows[0]
                }
            })

        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const selectQuery = `SELECT id, name, username, gender, role, points, created_at, updated_at 
            FROM users WHERE id = $1 AND active = true;`
            const values = [id]
            const user = await pg.query(selectQuery, values)
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
    getAll: async (req, res) => {
        try {
            const selectQuery = `SELECT id, name, username, gender, role, points, created_at, updated_at 
            FROM users WHERE active = true;`
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
            const validationResult = updatePasswordSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'failed', validationResult.error.message),
                    req,
                    res,
                    next)
            }
            const selectQuery = `SELECT * FROM users WHERE id = $1 AND active = true;`
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
            const updateQuery = `UPDATE users
            SET name = $1, username = $2, gender = $3, role = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5 AND active = true;`
            const updateValues = [body.name, body.username, body.gender, body.role, id]
            await pg.query(updateQuery, updateValues)
            const updatedUser = await qp.query('SELECT * FROM users WHERE id = $1;', [id])
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
            const updateQuery = 'UPDATE users SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1;'
            const values = [id]
            await pg.query(updateQuery, values)
            res.status(204).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default userController