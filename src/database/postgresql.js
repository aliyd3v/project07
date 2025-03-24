import postgres from "pg"
import { databaseUrl, postgresConfig } from "../config/config.js"

// For local working.
// const pg = new postgres.Client(postgresConfig)
// pg.connect()
//     .then(() => console.log('PostgreSQL is connected'))
//     .catch(err => console.error(err))

// For serverless working.
const pg = new postgres.Client({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false,
    }
})
async function connectWithRetry() {
    try {
        await pg.connect()
        console.log('PostgreSQL (Neon) is connected')
    } catch (error) {
        console.error(error)
        setTimeout(connectWithRetry, 5000);
    }
}
connectWithRetry()

export default pg