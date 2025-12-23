import User from '../models/user.model.js'


export const approveUser = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            { isVisible: true }, 
            { new: true }
        );
        res.status(200).json({ message: "User approved", user: updateUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
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

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (!users.length) return res.status(404).json({ message: "No users found" });
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}