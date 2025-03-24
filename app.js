import express from 'express'
import router from './src/route/route.js'
import cors from 'cors'
import globalErrorHandler from './src/controller/error.js'

// Setup app.
const app = express()

// Setup body parsing.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Setup Router.
app.use(router)
app.use(globalErrorHandler)

export default app