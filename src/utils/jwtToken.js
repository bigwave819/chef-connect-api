import jwt from 'jsonwebtoken'
import ENV from '../config/env.js'

const jwtToken = (payload) => {
    return jwt.sign({ payload }, ENV.JWT_SECRET, { expiresIn: '5d' })
}

export default jwtToken