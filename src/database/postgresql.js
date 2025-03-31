import postgres from "pg"
import { databaseUrl, postgresConfig } from "../config/config.js"

// For local working.
const pg = new postgres.Client(postgresConfig)
pg.connect()
    .then(() => console.log('PostgreSQL is connected'))
    .catch(err => console.error(err))

// For serverless working.
// const pg = new postgres.Client({
//     connectionString: databaseUrl,
//     ssl: {
//         rejectUnauthorized: false,
//     },
//     reconnect: true,
//     connectionTimeoutMillis: 10000
// })
// pg.connect()
//     .then(() => console.log('PostgreSQL (Neon) is connected'))
//     .catch(err => console.error(`DATABASE CONNECT ERROR:`, err))

export default pg