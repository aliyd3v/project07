import http from 'http'
import app from './app.js'
import { host, port } from './src/config/config.js'
import { Server } from 'socket.io'
import registerSocketHandler from './socket/index.js'

// Setup server.
const server = http.createServer(app)

// Setup socket.io.
const io = new Server(server, {
    cors: { origin: '*' }
})

// Register Socket handler.
registerSocketHandler(io)

// Setup server port.
server.listen(port, host, () => console.log(`Server running on port ${port}`))