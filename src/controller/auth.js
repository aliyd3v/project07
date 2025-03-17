import pg from '../database/postgresql.js'
import AppError from '../utils/appError.js'
import jwt from 'jsonwebtoken'
import PassController from '../helper/scrypt.js'
import { jwtKey, jwtExpiresIn } from '../config/config.js'
import { loginSchema } from '../utils/validateSchemas.js'

const authController = {
    login: (req, res, next) => {
        const { body } = req
        try {
            const validationResult = loginSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'fail', validationResult.error),
                    req,
                    res,
                    next
                )
            }
            const selectQuery = 'select id, name, username, role from users where username = $1;'
            const values = [body.username]
            const user = pg.query(selectQuery, values)
            if (!user) {
                return next(
                    new AppError(401, 'fail', 'Username is wrong!'),
                    req,
                    res,
                    next
                )
            }
            const checked = PassController.check(body.password, user.password)
            if (!checked) {
                return next(
                    new AppError(401, 'fail', 'Password is wrong!'),
                    req,
                    res,
                    next
                )
            }
            const payload = {
                id: user.id,
                role: user.role
            }
            const token = jwt.sign(payload, jwtKey, { expiresIn: jwtExpiresIn })
            res.status(200).json({
                status: 'success',
                token,
                data: {
                    user
                }
            })
        } catch (error) {
            next(error)
        }
    },
    checkToken: async (req, res, next) => {
        try {
            let token
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1]
            }
            if (!token) {
                return next(
                    new AppError(401, 'fail', 'You are not logged in! Please login in to continue.'),
                    req,
                    res,
                    next
                )
            }

            const decode = jwt.verify(token, jwtKey)
            const selectQuery = 'select * from users where id = $1;'
            const values = [decode.id]
            const user = await pg.query(selectQuery, values)
            if (!user) {
                return next(
                    new AppError(404, 'fail', 'This user is no longer exist.'),
                    req,
                    res,
                    next
                )
            }

            req.user = user
            next()
        } catch (error) {
            next(error)
        }
    },
    checkRoles: async (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(
                    new AppError(403, 'fail', 'You are not allowed to do this action.'),
                    req,
                    res,
                    next
                )
            }
            next()
        }
    }
}

export default authController