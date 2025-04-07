import customerEvent from "./events/customerEvent.js"
import adminEvent from "./events/adminEvent.js"
import staffEvent from './events/staffEvent.js'
import eventHandler from "./events/eventHandler.js"

export default io => {
    io.on('connection', socket => {
        customerEvent.menu(io, socket)
        adminEvent.category(io, socket)
        adminEvent.meal(io, socket)
        staffEvent.tables(io, socket)
        // eventHandler(io, socket)
    })
}