import mongoose from "mongoose";

export const profileSchema = new mongoose.Schema({
    image : [
        {
            type: String,
            required: true
        }
    ],
    phone: {
        type: String,
        required: true
    },
    bio: {
        type:String,
        required: true
    },
    email: {
        type: String,
    }
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "chef", "protocol", "admin"],
        default: "user"
    },
    profile: profileSchema,
    isVisible: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User;