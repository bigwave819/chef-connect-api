import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
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
        required: true
    }
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile