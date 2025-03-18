import http from 'http'
import app from './app.js'
import { port } from './src/config/config.js'
import { Server } from 'socket.io'
import ioRouter from './src/route/ioRoute.js'

// Setup server.
const server = http.createServer(app)

// Setup socket.io.
const io = new Server(server)
io.use(ioRouter.global)
io.on('connection', (socket) => {
    console.log(`Connection`)
    io.on(ioRouter.newOrder)
    io.on(ioRouter.prepared)
    io.on('disconnection', (socket) => {
        console.log('Disconnected')
    })
})

// Setup server port.
server.listen(port, () => console.log(`Server running on port ${port}`))