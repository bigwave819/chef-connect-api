import mongoose from "mongoose";
import { ENV } from "./env.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.DB_URL)
        console.log('connected to the db successfully');
        
        
    } catch (error) {
        console.log(`error connecting to the db ${error}`)
        console.log("this is the error", ENV.DB_URL);
        process.exit(1)
    }
}