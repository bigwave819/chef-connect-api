import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'

const jwtToken = (id) => {
    return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: '5d' })
}

export default jwtToken