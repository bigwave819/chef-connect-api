import User from '../models/user.model.js'


export const approveUser = async () => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }

        const updateUser = await User.findOneAndUpdate(
            { user: user._id },
            req.body,
            { new: true }
        )

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "User is now Visible",
            user: updateUser
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const rejectUser = async () => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }

        const updateUser = await User.findOneAndUpdate(
            { user: user._id },
            req.body,
            { new: true }
        )

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "Account is Visible now",
            user: updateUser
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
    }
}

export const getAllUser = async () => {
    try {
        const user = await User.find()

        if (user.length === 0) {
            return res.status(404).json({ message: "No profile found" })
        }
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
    }
}