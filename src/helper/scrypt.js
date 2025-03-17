import { scrypt } from 'crypto'
import util from 'util'
import { salt } from '../config/config.js'

const PassController = {
    hash: async (string) => {
        const hashBuffer = await util.promisify(scrypt)(string, salt, 32)
        return `${hashBuffer.toString('hex')}`
    },
    check: async (string, hash) => {
        return await this.scryptHash(string, salt) === hash
    }
}

export default PassController