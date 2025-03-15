import express from 'express'
import router from './src/route/route.js'
import cors from 'cors'
import { port } from './src/config/config.js'
import globalErrorHandler from './src/controller/errorController.js'

// Setup app.
const app = express()

// Setup body parsing.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Setup Router.
app.use(router)
app.use(globalErrorHandler)

// Setup server port.
app.listen(port, () => console.log(`Server running on port ${port}`))