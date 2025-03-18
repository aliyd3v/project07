const router = {
    global: (socket, next) => {
        next()
    },
    newOrder: ('new-order', (socket) => {

    }),
    prepared: ('prepared', (socket) => {

    })
}

export default router
