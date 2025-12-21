import express from 'express'
import { connectDB } from './src/config/db.js'
import { ENV } from './src/config/env.js'
import useRoutes from './src/routes/user.route.js'
import cors from 'cors'
import adminRoutes from './src/routes/admin.route.js'


const app = express()
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))


app.use('/api/user', useRoutes)
app.use('/api/admin', adminRoutes)

connectDB()

app.listen(ENV.PORT, () => {
  console.log(`the server is running on the ${ENV.PORT}`);

})