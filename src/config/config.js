import dotenv from 'dotenv'
dotenv.config()

// PORT
export const port = process.env.PORT

// DOMAIN
export const domain = process.env.DOMAIN

// Postgresql config
export const postgresConfig = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

// JWT config
export const jwtKey = process.env.JWT_KEY
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN

// Salt for crypto
export const salt = process.env.SALT