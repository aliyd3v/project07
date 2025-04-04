import express from 'express'
import router from './src/route/router.js'
import cors from 'cors'
import globalErrorHandler from './src/controller/error.js'
import helmet from 'helmet'

// Setup app.
const app = express()

app
    // Setup body parsing.
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors())
    .use(helmet())

    // Setup Router.
    .use(router)
    .use(globalErrorHandler)

export default app