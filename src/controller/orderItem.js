import pg from "../database/postgresql.js"
import AppError from "../utils/appError.js"

const orderItemController = {
    changeToPrepared: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const orderItem = await pg.query(
                `SELECT id, status, meal_id, order_id FROM order_items WHERE id = $1;`,
                [id]
            )
            if (!orderItem.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that order-item id.`),
                    req,
                    res,
                    next
                )
            }
            if (orderItem.rows[0].status != 'Pending') {
                return next(
                    new AppError(400, 'fail', `That order item status is not 'Pending' for do 'Prepared'!`),
                    req,
                    res,
                    next
                )
            }
            const meal = await pg.query(
                `SELECT id, active, is_ready_product FROM meals WHERE id = $1;`,
                [orderItem.rows[0].meal_id]
            )
            if (!meal.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that meal id.`),
                    req,
                    res,
                    next
                )
            }
            if (!meal.rows[0].active) {
                return next(
                    new AppError(400, 'fail', `That meal is not active!`),
                    req,
                    res,
                    next
                )
            }
            if (meal.rows[0].is_ready_product) {
                return next(
                    new AppError(400, 'fail', `Is ready product, not for preparing!`),
                    req,
                    res,
                    next
                )
            }
            await pg.query(
                `UPDATE order_items SET status = $1 WHERE id = $2;`,
                ['Prepared', id]
            )
            const order = await pg.query(
                `SELECT o.id AS id, 
o.status AS status,
COALESCE(
    json_agg(
        json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'meal', json_build_object(
                'id', m.id,
                'name', m.name,
                'price', m.price,
                'is_ready_product', m.is_ready_product
            ),
            'status', oi.status
        )
    ) FILTER (WHERE oi.id IS NOT NULL), '[]'
) AS order_items,
json_build_object(
    'id', t.id,
    'number', t.number,
    'active', t.active
) AS table
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN meals m ON oi.meal_id = m.id
LEFT JOIN tables t ON o.table_id = t.id
WHERE o.id = $1
GROUP BY o.id, t.id, t.number, t.active;`,
                [orderItem.rows[0].order_id]
            )
            if (!order.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that order id.`),
                    req,
                    res,
                    next
                )
            }
            const table = await pg.query(
                `SELECT id, number, active FROM tables WHERE id = $1 AND active = true;`,
                [order.rows[0].table.id]
            )
            if (!table.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that table id.`),
                    req,
                    res,
                    next
                )
            }
            const orderItemsArr = order.rows[0].order_items.map(i => {
                if (i.status == 'Pending') {
                    return true
                }
            })
            if (!orderItemsArr.includes(true)) {
                await pg.query(
                    `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
                    ['Prepared', order.rows[0].id]
                )
            }
            res.status(200).json({
                status: 'success',
                table: { number: table.rows[0].number },
                data: null
            })
        } catch (error) {
            next(error)
        }
    },
    changeToDelivered: async (req, res, next) => {
        const { params: { id } } = req
        try {
            const orderItem = await pg.query(
                `SELECT id, status, meal_id, order_id FROM order_items WHERE id = $1;`,
                [id]
            )
            if (!orderItem.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that order-item id.`),
                    req,
                    res,
                    next
                )
            }
            const meal = await pg.query(
                `SELECT id, active, is_ready_product FROM meals WHERE id = $1;`,
                [orderItem.rows[0].meal_id]
            )
            if (!meal.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that meal id.`),
                    req,
                    res,
                    next
                )
            }
            if (!meal.rows[0].active) {
                return next(
                    new AppError(400, 'fail', `That product is not active!`),
                    req,
                    res,
                    next
                )
            }
            if (meal.rows[0].is_ready_product) {
                if (orderItem.rows[0].status != 'Pending') {
                    return next(
                        new AppError(400, 'fail', `That order item status is not 'Pending' for do 'Delivered'!`),
                        req,
                        res,
                        next
                    )
                }
            } else {
                if (orderItem.rows[0].status != 'Prepared') {
                    return next(
                        new AppError(400, 'fail', `That order item status is not 'Prepared' for do 'Delivered'!`),
                        req,
                        res,
                        next
                    )
                }
            }
            await pg.query(
                `UPDATE order_items SET status = $1 WHERE id = $2;`,
                ['Delivered', id]
            )
            const order = await pg.query(
                `SELECT o.id AS id, 
o.status AS status,
COALESCE(
    json_agg(
        json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'meal', json_build_object(
                'id', m.id,
                'name', m.name,
                'price', m.price,
                'is_ready_product', m.is_ready_product
            ),
            'status', oi.status
        )
    ) FILTER (WHERE oi.id IS NOT NULL), '[]'
) AS order_items,
json_build_object(
    'id', t.id,
    'number', t.number,
    'active', t.active
) AS table
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN meals m ON oi.meal_id = m.id
LEFT JOIN tables t ON o.table_id = t.id
WHERE o.id = $1
GROUP BY o.id, t.id, t.number, t.active;`,
                [orderItem.rows[0].order_id]
            )
            if (!order.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that order id.`),
                    req,
                    res,
                    next
                )
            }
            const table = await pg.query(
                `SELECT id, number, active FROM tables WHERE id = $1 AND active = true;`,
                [order.rows[0].table.id]
            )
            if (!table.rowCount) {
                return next(
                    new AppError(404, 'fail', `No document found with that table id.`),
                    req,
                    res,
                    next
                )
            }
            const orderItemsArr = order.rows[0].order_items.map(i => {
                if (i.status == 'Pending' || i.status == 'Prepared') {
                    return true
                }
            })
            if (!orderItemsArr.includes(true)) {
                await pg.query(
                    `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
                    ['Delivered', order.rows[0].id]
                )
            }
            res.status(200).json({
                status: 'success',
                table: { number: table.rows[0].number },
                data: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default orderItemController