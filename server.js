import express from 'express'
import { connectDB } from './src/config/db.js'
import { ENV } from './src/config/env.js'
import userRoutes from './src/routes/user.route.js'
import cors from 'cors'
import adminRoutes from './src/routes/admin.route.js'
import cookieParser from 'cookie-parser';
import bookingRoutes from './src/routes/booking.route.js'


const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({
  origin: ["https://rwanda-events.vercel.app", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}))



app.use('/api/user', userRoutes)
app.use("/api/bookings", bookingRoutes);
app.use('/api/admin', adminRoutes)

connectDB()

app.listen(ENV.PORT, () => {
  console.log(`the server is running on the ${ENV.PORT}`);

})