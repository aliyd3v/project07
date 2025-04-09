import pg from "../database/postgresql.js"
import AppError from "../utils/appError.js"
import { createOrderSchema } from "../utils/validateSchemas.js"

const orderController = {
    createOne: async (req, res, next) => {
        const { body, user } = req
        try {
            const validationResult = createOrderSchema.validate(body)
            if (validationResult.error) {
                return next(
                    new AppError(400, 'fail', validationResult.error.message),
                    req,
                    res,
                    next
                )
            }
            const table = await pg.query(
                `SELECT id, number FROM tables WHERE $1 AND active = true;`,
                [body.table_id]
            )
            if (!table.rowCount) {
                return next(
                    new AppError(400, 'fail', `No document found with that table id.`),
                    req,
                    res,
                    next
                )
            }

            await body.meals.forEach(async el => {
                const meal = await pg.query(
                    `SELECT id, name, price FROM meals
                    WHERE id = $1 AND active = true;`,
                    [el.mealId]
                )
                if (!meal.rowCount) {
                    return next(
                        new AppError(400, 'fail', `No document found with meal id ${el.mealId}.`),
                        req,
                        res,
                        next
                    )
                }
            })

            const insertQuery = `INSERT INTO orders (table_id, service_staff_id)
            VALUES ($1, $2) RETURNING id, table_id, service_staff_id, created_at;`
            const values = [body.table_id, user.id]
            const order = await pg.query(insertQuery, values)

            await body.meals.forEach(async el => {
                const meal = await pg.query(
                    `SELECT id, is_ready_product FROM meals WHERE id = $1;`,
                    [el.mealId]
                )
                await pg.query(
                    `INSERT INTO order_items(order_id, meal_id, quantity, status)
VALUES($1, $2, $3, $4);`,
                    [
                        order.rows[0].id,
                        el.mealId,
                        el.quantity,
                        meal.is_ready_product ? 'Prepared' : 'Pending'
                    ]
                )
            })

            const selectQuery = `SELECT 
o.id AS order_id,
json_build_object(
    'id', t.id,
    'number', t.number
) AS table,
json_build_object(
    'id', u.id,
    'name', u.name,
    'username', u.username,
    'role', u.role,
    'gender', u.gender
) AS service_staff,
COALESCE(
    json_agg(
        json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'meal', json_build_object(
                'id', m.id,
                'name', m.name,
                'price', m.price,
                'is_ready_product', m.is_ready_product,
                'category', json_build_object(
                    'id', c.id,
                    'name', c.name
                )
            )
        )
    ) FILTER (WHERE oi.id IS NOT NULL), '[]'
) AS order_items
FROM orders o
LEFT JOIN tables t ON o.table_id = t.id
LEFT JOIN users u ON o.service_staff_id = u.id
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN meals m ON oi.meal_id = m.id
LEFT JOIN categories c ON m.category_id = c.id
WHERE o.id = $1
GROUP BY o.id, t.id, t.number, u.id, u.name, u.username, u.role, u.gender;`
            const selectValues = [order.rows[0].id]
            const fullOrder = await pg.query(selectQuery, selectValues)

            res.status(201).json({
                status: 'success',
                data: {
                    order: fullOrder.rows[0]
                }
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const selectQuery = `SELECT 
o.id AS id,
o.status AS status,
json_build_object(
    'id', t.id,
    'number', t.number
) AS table,
json_build_object(
    'id', u.id,
    'name', u.name,
    'username', u.username,
    'role', u.role,
    'gender', u.gender
) AS service_staff,
COALESCE(
    json_agg(
        json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'meal', json_build_object(
                'id', m.id,
                'name', m.name,
                'price', m.price,
                'is_ready_product', m.is_ready_product,
                'category', json_build_object(
                    'id', c.id,
                    'name', c.name
                )
            )
        )
    ) FILTER (WHERE oi.id IS NOT NULL), '[]'
) AS order_items,
o.created_at AS created_at,
o.updated_at AS updated_at
FROM orders o
LEFT JOIN tables t ON o.table_id = t.id
LEFT JOIN users u ON o.service_staff_id = u.id
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN meals m ON oi.meal_id = m.id
LEFT JOIN categories c ON m.category_id = c.id
WHERE o.id = $1
GROUP BY o.id, t.id, t.number, u.id, u.name, u.username, u.role, u.gender 
ORDER BY o.created_at;`
            const values = [id]
            const order = await pg.query(selectQuery, values)
            if (!order.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that order id.`),
                    req,
                    res,
                    next
                )
            }
            res.status(200).json({
                status: 'success',
                data: {
                    order: order.rows[0]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const orders = await pg.query(
                `SELECT 
o.id AS id,
o.status AS status,
json_build_object(
    'id', t.id,
    'number', t.number
) AS table,
json_build_object(
    'id', u.id,
    'name', u.name,
    'username', u.username,
    'role', u.role,
    'gender', u.gender
) AS service_staff,
COALESCE(
    json_agg(
        json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'meal', json_build_object(
                'id', m.id,
                'name', m.name,
                'price', m.price,
                'image_url', m.image_url,
                'is_ready_product', m.is_ready_product,
                'category', json_build_object(
                    'id', c.id,
                    'name', c.name
                )
            )
        )
    ) FILTER (WHERE oi.id IS NOT NULL), '[]'
) AS order_items,
o.created_at AS created_at,
o.updated_at AS updated_at
FROM orders o
LEFT JOIN tables t ON o.table_id = t.id
LEFT JOIN users u ON o.service_staff_id = u.id
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN meals m ON oi.meal_id = m.id
LEFT JOIN categories c ON m.category_id = c.id
GROUP BY o.id, t.id, t.number, u.id, u.name, u.username, u.role, u.gender 
ORDER BY o.created_at;`
            )
            res.status(200).json({
                status: 'success',
                data: {
                    orders: orders.rows
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

export default orderController