import dotenv from 'dotenv'

dotenv.config({ quiet: true })

export const ENV = {
    NODE_ENV : process.env.NODE_ENV,
    PORT : process.env.PORT,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_EMAIL : process.env.ADMIN_EMAIL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY
}