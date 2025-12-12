import express from 'express'
import { connectDB } from './src/config/db.js'
import { ENV } from './src/config/env.js'
import useRoutes from './src/routes/user.route.js'
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/user', useRoutes)

connectDB()

app.listen(ENV.PORT, () => {
    console.log(`the server is running on the 3000 ${ENV.PORT}`);
    
})