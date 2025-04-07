import { domain } from '../../src/config/config.js'

export default (io, socket) => {
    socket.use((event, ...args) => {
        socket.emit('error', { message: `Event '${event}' not recognized!` })
    })
}