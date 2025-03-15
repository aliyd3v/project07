import express from "express"
import userController from "../controller/user.js"
import categoryController from '../controller/category.js'
import mealController from '../controller/meal.js'
import authController from '../controller/auth.js'
import AppError from '../utils/appError.js'

const router = express.Router()

// Auth route.
router
    .post('/login', authController.login)

//User route.
router
    .route('/user')
    .post(userController.create)
    .get(userController.getAll)
router
    .route('/id')
    .get(userController.get)
    .put(userController.update)
    .delete(userController.delete)

//Category route.
router
    .route('/category')
    .post(categoryController.create)
    .get(categoryController.getAll)
router
    .route('/category/id')
    .get(categoryController.get)
    .put(categoryController.update)
    .delete(categoryController.delete)

// Meal route.
router
    .route('/meal')
    .post(mealController.create)
    .get(mealController.getAll)
router
    .route('/meal/id')
    .get(mealController.get)
    .put(mealController.update)
    .delete(mealController.delete)

// Handle not found route.
router
    .use('*', (req, res, next) => {
        next(new AppError(404, 'fail', 'Undefined route!'))
    })

export default router