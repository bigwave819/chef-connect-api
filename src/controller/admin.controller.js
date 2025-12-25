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

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (!users.length) return res.status(404).json({ message: "No users found" });
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ isVisible: true });
    const unapprovedUsers = await User.countDocuments({ isVisible: false });

    // Count users per role
    const rolesAggregation = await User.aggregate([
      { 
        $group: { 
          _id: "$role", 
          count: { $sum: 1 } 
        } 
      }
    ]);

    const rolesCount = rolesAggregation.reduce((acc, role) => {
      acc[role._id] = role.count;
      return acc;
    }, {});

    res.status(200).json({
      totalUsers,
      approvedUsers,
      unapprovedUsers,
      rolesCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};