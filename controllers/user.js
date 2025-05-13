import { User } from "../models/User.js"; // Import User model
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js"; // Import TryCatch middleware

// Register User
export const register = TryCatch(async (req, res) => {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email }); // Check if user already exists
    if (user) {
        return res.status(400).json({ 
            message: "User already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10); // Hash the password

    user = {
        name,
        email,
        password: hashPassword,
    };

    const otp = Math.floor(Math.random() * 1000000);

    const activationToken = jwt.sign(
        { user, otp },
        process.env.Activation_Secret,
        { expiresIn: "5m" } // Token expires in 5 minutes
    );

    const data = {
        name,
        otp,
    };

    await sendMail(email, "Learn From Basics", data);

    res.status(200).json({
        message: "OTP Sent! User registered successfully",
        activationToken,
    });
});

// Verify OTP and Create User
export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;

    let verify;
    try {
        verify = jwt.verify(activationToken, process.env.Activation_Secret);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "OTP Expired" });
        }
        return res.status(400).json({ message: "Invalid Activation Token" });
    }

    if (verify.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
    });

    res.status(201).json({
        message: "User verified and created successfully",
    });
});

// Login User
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User not found, No User with this Email",
        });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        return res.status(400).json({
            message: "Invalid / Wrong password!",
        });
    }

    const token = jwt.sign({ _id: user._id }, process.env.Jwt_Secret, {
        expiresIn: "1d",
    });

    res.json({
        message: `Welcome back! ${user.name}. You are logged in successfully`,
        token,
        user,
    });
});

// Get User Profile
export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ user });
});
