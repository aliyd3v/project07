import express from 'express'
import router from './src/route/route.js'
import { port } from './src/config/config.js'

// Setup app.
const app = express()

// Setup body parsing.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Setup Router.
app.use(router)

// Setup server port.
app.listen(port, (err) => console.log(`Server running on port ${port}`))