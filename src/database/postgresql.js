import { Client } from "pg"
import { postgresConfig } from "../config/config"

const pg = new Client(postgresConfig)

export default pg