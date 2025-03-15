import postgres from "pg"
import { postgresConfig } from "../config/config.js"

const pg = new postgres.Client(postgresConfig)

pg.connect()
    .then(() => console.log('PostgreSQL is connected'))
    .catch(err => console.error(err))

export default pg