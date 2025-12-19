import User from '../models/user.model.js'
import jwtToken from '../utils/jwtToken.js'
import bcrypt from 'bcryptjs'
import Profile from '../models/profile.model.js'


export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "No such user" })
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwtToken(user._id)

        res.status(200).json({
            message: "Login Success",
            user,
            token
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
    }
}


export const createProfile = async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            res.status(404).json({ message: "No user Found" })
        }

        const { image, phone, bio, email } = req.body

        if (!image || !phone || !bio || !email) {
            res.status(400).json({ message: 'All Fields are required' })
        }

        const exists = await Profile.findOne({ user: user._id })
        if (exists) {
            return res.status(400).json({ message: "Profile already exists" })
        }

        const profile = new Profile({
            user: user._id,
            image,
            phone,
            bio,
            email
        })

        user.profile = profile._id
        await profile.save()

        res.status(201).json({
            message: 'Profile Created',
            profile
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}

export const getProfile = async (_, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name email role")

    if (profiles.length === 0) {
      return res.status(404).json({ message: "No profile found" })
    }

    res.status(200).json(profiles)
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}


export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(404).json({ message: "Profile not Found" })
        }

        const result = await Profile.findByIdAndDelete(id)

        if (!result) {
            res.status(400).json({ message: "Delete Profile Failed" })
        }

        res.status(200).json({ message: 'Delete Profile Success' })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}

export const updateProfile = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(404).json({ message: "No user found" })
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: user._id },
      req.body,
      { new: true }
    )

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}
