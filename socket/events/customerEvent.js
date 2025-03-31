import { port } from '../../src/config/config.js'

export default {
    menu: (io, socket) => {
        socket.on('get-menu', async () => {
            try {
                const response = await fetch(`http://localhost:${port}/categories-with-meals`)
                const res = await response.json()
                socket.emit('menu', { categories: res.data.categories })
            } catch (error) {
                socket.emit('error', { error })
            }
        })
    }
}