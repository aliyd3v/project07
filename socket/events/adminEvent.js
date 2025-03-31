import { port } from '../../src/config/config.js'

export default {
    category: (io, socket) => {
        socket.on('get-categories', async ({ token }) => {
            try {
                const response = await fetch(`http://localhost:${port}/category`, { headers: { 'Authorization': `Bearer ${token}` } })
                const res = await response.json()
                if (res.status == 'success') {
                    socket.emit('categories', { categories: res.data.categories, error: null })
                } else {
                    socket.emit('categories', { categories: null, error: 'error fetch meals' })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
    },
    meal: (io, socket) => {
        socket.on('get-meals', async ({ token }) => {
            try {
                const response = await fetch(`http://localhost:${port}/meal`, { headers: { 'Authorization': `Bearer ${token}` } })
                const res = await response.json()
                if (res.status == 'success') {
                    socket.emit('meals', { meals: res.data.meals, error: null })
                } else {
                    socket.emit('meals', { meals: null, error: 'error fetch meals' })
                }
            } catch (error) {
                socket.emit('error', { error })
            }
        })
    },
    user: () => { }
}