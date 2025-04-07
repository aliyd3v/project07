import { domain } from '../../src/config/config.js'

export default {
    tables: (io, socket) => {
        socket.on('get-tables', async ({ token }) => {
            try {
                console.log('hello')
                const response = await fetch(`${domain}/table`)
                const res = await response.json()
                socket.emit('tables', { tables: res.data.tables })
            } catch (error) {
                socket.emit('error', { error })
            }
        })
    }
}