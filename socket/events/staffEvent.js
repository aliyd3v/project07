import { domain } from '../../src/config/config.js'

export default {
    tables: (io, socket) => {
        socket.on('get-tables', async ({ token }) => {
            try {
                const response = await fetch(`${domain}/table`, { headers: { 'Authorization': `Bearer ${token}` } })
                const res = await response.json()
                if (res.status == 'success') {
                    socket.emit('tables', { tables: res.data.tables, error: null })
                } else {
                    socket.emit('tables', { tables: null, error: 'error fetch meals' })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
    },
    order: (io, socket) => {
        socket.on('create-order', async ({ token, table, cart }) => {
            try {
                const payload = { table_id: table, meals: cart }
                const response = await fetch(`https://api.aif.uz/order`, {
                    method: 'post', headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                })
                const res = await response.json()
                if (res.status == 'success') {
                    io.emit('new-order', { order: res.data.order, error: null })
                } else {
                    socket.emit('new-order', { order: null, error: 'error fetch create order' })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
        socket.on('get-orders', async ({ token }) => {
            try {
                const response = await fetch(`${domain}/order`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const res = await response.json()
                if (res.status == 'success') {
                    socket.emit('orders', { orders: res.data.orders, error: null })
                } else {
                    socket.emit('orders', { orders: null, error: 'error fetch orders' })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
        socket.on('order-item-prepared', ({ token, order_id, order_item_id }) => {
            try {

                // Write here. Before think, after write!
                // Write here. Before think, after write!
                // Write here. Before think, after write!
                // Write here. Before think, after write!
                // Write here. Before think, after write!

            } catch (error) {
                socket.emit('error', { error })
            }
        })
    }
}