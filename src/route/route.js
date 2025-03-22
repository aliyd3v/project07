import express from "express"
import userController from "../controller/user.js"
import categoryController from '../controller/category.js'
import mealController from '../controller/meal.js'
import authController from '../controller/auth.js'
import AppError from '../utils/appError.js'
import tableController from "../controller/table.js"
import orderController from "../controller/order.js"

const router = express.Router()

// Auth route.
router
    .post('/login', authController.login)

//User route.
router
    .route('/user')
    .post(userController.createOne)
    .get(userController.getAll)
router
    .route('/user/:id')
    .get(userController.getOne)
    .put(userController.updateOne)
    .delete(userController.deleteOne)

//Category route.
router
    .route('/category')
    .post(categoryController.createOne)
    .get(categoryController.getAll)
router
    .route('/category/:id')
    .get(categoryController.getOne)
    .put(categoryController.updateOne)
    .delete(categoryController.deleteOne)
    .put(categoryController.changeActive)

// Meal route.
router
    .route('/meal')
    .post(mealController.createOne)
    .get(mealController.getAll)
router
    .route('/meal/:id')
    .get(mealController.getOne)
    .put(mealController.updateOne)
    .delete(mealController.deleteOne)
    .put(mealController.changeActive)

// Category with meals.
router
    .route('/categories-with-meals')
    .get(categoryController.getCategoriesWithMeals)

// Table route.
router
    .route('/table')
    .post(tableController.createOne)
    .get(tableController.getAll)

// Order route.
router
    .route('/order')
    .post(orderController.createOne)
router
    .route('/order/:id')
    .get(orderController.getOne)

// Handle not found route.
router
    .use('*', (req, res, next) => {
        next(new AppError(404, 'fail', 'Undefined route!'))
    })

export default router