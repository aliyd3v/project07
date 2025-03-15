import pg from '../database/postgresql.js'
import AppError from '../utils/appError.js'
import { createUserSchema } from '../utils/validateSchemas.js'

const userController = {
    create: async (req, res, next) => {
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
                'select * from users where username = $1', [body.username]
            )
            if (condidat.rows.length) {
                return next(
                    new AppError(400, 'fail', `Username \'${body.username}\' is already used!`),
                    req,
                    res,
                    next)
            }

            const insertQuery = 'insert into users(name, username, password, gender, role) values($1, $2, $3, $4, $5);'
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

    get: (req, res) => { },

    getAll: async (req, res) => {
        try {
            const users = await pg.query(`SELECT * FROM users;`)

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

    update: (req, res) => { },

    delete: (req, res) => { }
}

export default userController