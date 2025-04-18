import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sharp from "sharp";

export const signup = async (req, res) => {
    const { email, password, fullname } = req.body;
    try {
        //required
        if (!fullname || !email || !password) return res.status(400).json({ message: "All fields are required" });

        //validation for password
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        //check if the user exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePicture,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return res.status(400).json({ message: "Both email and password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        //if user exist then check if password match
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        //if password correct return token
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;

    try {
        const userId = req.user._id;
        if (!profilePic) return res.status(400).json({ message: "profilePic  is required" });

        // Check image size (base64 string length is approximately 4/3 of the original file size)
        const base64Size = profilePic.length * 0.75;
        const maxSize = 1024 * 1024; // 1MB in bytes

        if (base64Size > maxSize) {
            return res.status(400).json({ message: "Image size should be less than 1MB" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        console.log(uploadResponse);

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in profilePic controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        if (!users) return res.status(400).json({ message: "No users found" });

        res.status(200).json({ users });
    } catch (error) {
        console.log("Error in getAllUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params.id;

        const user = await User.findById(id).select("-password");
        if (!user) return res.status(400).json({ message: "No users found" });

        res.status(200).json({ user });
    } catch (error) {
        console.log("Error in getUserById controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(400).json({ message: "No user found with this Id" });

        res.status(200).json({ message: `User with id ${id} deleted successfully` });
    } catch (error) {
        console.log("Error in getAllUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
