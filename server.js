import http from 'http'
import app from './app.js'
import { port } from './src/config/config.js'
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
server.listen(port, () => console.log(`Server running on port ${port}`))


// This is function just for server! :D
const interval = setInterval(() => {
    console.log('Hello I\'am interval.')
}, 30000);
setTimeout(() => {
    clearInterval(interval)
    console.log('Interval is stoped.')
}, 1000 * 60 * 60);