import express from "express"
import userController from "../controller/user.js"
import categoryController from '../controller/category.js'
import mealController from '../controller/meal.js'
import authController from '../controller/auth.js'
import AppError from '../utils/appError.js'
import tableController from "../controller/table.js"
import orderController from "../controller/order.js"
import upload from "../helper/multer.js"

const router = express.Router()

///////////////////////////////////////////////
//              PUBLIC ROUTE                 //
///////////////////////////////////////////////

// Root request.
router
    .get('/', (req, res) => res.status(200).json({ message: `Hello, I'am Server!` }))

// Login.
router
    .post('/login', authController.login)

// Categories with meals.
router
    .route('/categories-with-meals')
    .get(categoryController.getCategoriesWithMeals)


///////////////////////////////////////////////
//              PRIVATE ROUTE                //
///////////////////////////////////////////////

//User route.
router
    .route('/user')
    .post(
        authController.checkToken,
        authController.checkRoles('Admin'),
        userController.createOne
    )
    .get(
        authController.checkToken,
        authController.checkRoles('Admin'),
        userController.getAll
    )
router
    .route('/user/:id')
    .get(
        authController.checkToken,
        authController.checkRoles('Admin'),
        userController.getOne
    )
    .put(
        authController.checkToken,
        authController.checkRoles('Admin'),
        userController.updateOne
    )
    .delete(
        authController.checkToken,
        authController.checkRoles('Admin'),
        userController.deleteOne
    )

//Category route.
router
    .route('/category')
    .post(
        authController.checkToken,
        authController.checkRoles('Admin'),
        categoryController.createOne
    )
    .get(
        authController.checkToken,
        authController.checkRoles('Admin'),
        categoryController.getAll
    )
router
    .route('/category/:id')
    .get(
        authController.checkToken,
        authController.checkRoles('Admin'),
        categoryController.getOne
    )
    .put(
        authController.checkToken,
        authController.checkRoles('Admin'),
        categoryController.updateOne
    )
    .delete(
        authController.checkToken,
        authController.checkRoles('Admin'),
        categoryController.deleteOne
    )
router
    .route('/category/:id/change-status')
    .put(
        authController.checkToken,
        authController.checkRoles('Admin'),
        categoryController.changeActive
    )

// Meal route.
router
    .route('/meal')
    .post(
        authController.checkToken,
        authController.checkRoles('Admin'),
        upload.single('image'),
        mealController.createOne
    )
    .get(
        authController.checkToken,
        authController.checkRoles('Admin'),
        mealController.getAll
    )
router
    .route('/meal/:id')
    .get(
        authController.checkToken,
        authController.checkRoles('Admin'),
        mealController.getOne
    )
    .put(
        authController.checkToken,
        authController.checkRoles('Admin'),
        upload.single('image'),
        mealController.updateOne
    )
    .delete(
        authController.checkToken,
        authController.checkRoles('Admin'),
        mealController.deleteOne
    )
router
    .route('/meal/:id/change-status')
    .put(
        authController.checkToken,
        authController.checkRoles('Admin'),
        mealController.changeActive
    )

// Table route.
router
    .route('/table')
    .post(
        authController.checkToken,
        authController.checkRoles('Admin'),
        tableController.createOne)
    .get(
        authController.checkToken,
        authController.checkRoles(
            'Admin',
            'Waitress',
            'Waiter'
        ),
        tableController.getAll)

// Order route.
router
    .route('/order')
    .post(
        authController.checkToken,
        authController.checkRoles(
            'Admin',
            'Waiter',
            'Waitress'
        ),
        orderController.createOne
    )
    .get(
        authController.checkToken,
        authController.checkRoles(
            'Admin',
            'Chef',
            'Cook',
            'Waiter',
            'Waitress'
        ),
        orderController.getAll
    )
router
    .route('/order/:id')
    .get(
        authController.checkToken,
        authController.checkRoles(
            'Admin',
            'Chef',
            'Cook',
            'Waiter',
            'Waitress'
        ),
        orderController.getOne
    )

// Handle not found route.
router
    .use('*', (req, res, next) => {
        next(new AppError(404, 'fail', 'Undefined route!'))
    })

export default router