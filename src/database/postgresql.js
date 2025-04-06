import postgres from "pg"
import { databaseUrl, postgresConfig, production } from "../config/config.js"

// For local working.
// const pg = new postgres.Client(postgresConfig)
// pg.connect()
//     .then(() => console.log('PostgreSQL is connected'))
//     .catch(err => console.error(err))

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

const pg = new postgres.Client(
    production == true ?
        {
            connectionString: databaseUrl,
            ssl: {
                rejectUnauthorized: false,
            },
            reconnect: true,
            connectionTimeoutMillis: 10000
        }
        :
        postgresConfig
)
pg.connect()
    .then(() => console.log(production == true ? 'PostgreSQL (Neon) is connected' : 'PostgreSQL is connected'))
    .catch(err => console.error(err))


export default pg