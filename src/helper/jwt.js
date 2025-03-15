import jwt from 'jsonwebtoken'
import { jwtExpiresIn, jwtKey } from '../config/config.js'

const TokenGenerate = payload => {
    return jwt.sign(payload, jwtKey, { expiresIn: jwtExpiresIn })
}

export default TokenGenerate