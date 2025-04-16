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
                const response = await fetch(`${domain}/order`, {
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const res = await response.json()
                if (res.status == 'success') {
                    io.emit('new-order', { order: res.data.order, order_items: res.data.order_items, error: null })
                } else {
                    socket.emit('new-order', { order: null, order_items: null, error: 'error fetch create order' })
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
        socket.on('order-item-prepared', async ({ token, order_item_id }) => {
            try {
                const response = await fetch(`${domain}/order-item/${order_item_id}/prepared`, {
                    method: 'put',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const res = await response.json()
                if (res.status == 'success') {
                    io.emit('prepared', { ok: true, table: res.table, error: null })
                } else {
                    socket.emit('prepared', { ok: false, table: undefined, error: (res.message || 'unknown error') })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
        socket.on('order-item-delivered', async ({ token, order_item_id }) => {
            try {
                const response = await fetch(`${domain}/order-item/${order_item_id}/delivered`, {
                    method: 'put',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const res = await response.json()
                if (res.status == 'success') {
                    io.emit('delivered', { ok: true, table: res.table, error: null })
                } else {
                    socket.emit('delivered', { ok: false, table: undefined, error: (res.message || 'unknown error') })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
        socket.on('update-orders', async ({ token }) => {
            try {
                const response = await fetch(`${domain}/order`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const res = await response.json()
                if (res.status == 'success') {
                    io.emit('orders', { orders: res.data.orders, error: null })
                } else {
                    socket.emit('orders', { orders: null, error: 'error fetch orders' })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
    }
}