import User from '../models/user.model.js'
import jwtToken from '../utils/jwtToken.js'
import bcrypt from 'bcryptjs'
import Profile from '../models/profile.model.js'
import cloudinary from '../config/cloudinary.js'


export const Register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

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
            role: role || "user",
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

        const { password: _, ...safeUser } = user.toObject();

        res.status(200).json({
            message: "Login Success",
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
    }
}

export const getSpecificUser = async (req, res) => {
    try {
        const { id } = req.params

        const specificUser = await User.findById(id).select('-password');

        if (!specificUser) {
            return res.status(404).json({ message: "No such user found" });
        }

        return res.status(200).json(specificUser);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
    }
}


export const createProfile = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { username, phone, bio, email } = req.body

    if (!username || !phone || !bio || !email) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" })
    }

    if (req.files.length > 2) {
      return res.status(400).json({ message: "Maximum 2 images allowed" })
    }

    const existing = await Profile.findOne({ user: user._id })
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" })
    }

    const uploads = await Promise.all(
      req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "profiles" })
      )
    )

    const imageUrls = uploads.map(img => img.secure_url)

    const profile = await Profile.create({
      user: user._id,
      username,
      phone,
      bio,
      email,
      image: imageUrls,
    })

    await User.findByIdAndUpdate(user._id, { profile: profile._id })

    return res.status(201).json({
      message: "Profile created successfully",
      profile,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProfiles = async (_, res) => {
    try {
        const profiles = await Profile.find().populate("user", "name email role")

        if (profiles.length === 0) {
            return res.status(404).json({ message: "No profile found" })
        }

        res.status(200).json(profiles)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
    }
}
export const getMyProfile = async (req, res) => {
    try {
        // Find profile by the ID attached to the token
        const profile = await Profile.findOne({ user: req.user._id });
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const getSpecificProfile = async (req, res) => {
    try {
        const { id } = req.params

        const profile = await Profile.findById(id)

        if (!profile) {
            return res.status(404).json({ message: "profile not found" })
        }

        res.status(200).json(profile)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
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
            return res.status(401).json({ message: "Unauthorized" })
        }

        const profile = await Profile.findOne({ user: user._id })
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }

        const { phone, bio, email } = req.body

        if (phone) profile.phone = phone
        if (bio) profile.bio = bio
        if (email) profile.email = email

        // Handle image update if new images provided
        if (req.files && req.files.length > 0) {
            if (req.files.length > 2) {
                return res.status(400).json({ message: "Maximum 2 images allowed" })
            }

            const uploadResults = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: "profiles" })
                )
            )

            profile.image = uploadResults.map(img => img.secure_url)
        }

        await profile.save()

        res.status(200).json({
            message: "Profile updated successfully",
            profile
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server error" })
    }
}

