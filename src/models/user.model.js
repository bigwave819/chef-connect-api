import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
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
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile"
    },
    isVisible: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User;