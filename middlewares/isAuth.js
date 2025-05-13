import jwt from "jsonwebtoken";
import { User } from "../models/User.js"; // Import the User model
import TryCatch from "./TryCatch.js";

export const isAuth = async(req, res, next) => {
    try {
        const token = req.headers.token; 

        if (!token) {
            return res.status(403).json({
                message: "Please login!" 
            });
        }
        const decodedData = jwt.verify(token, process.env.Jwt_Secret); // Verify the token using the secret key

        req.user = await User.findById(decodedData._id); // Find the user by ID from the decoded token

        next(); // Call next() to proceed to the next middleware
        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error, Login again",
        });
    }
}

export const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to access this resource! Because, You are not Admin..",
            });
        }
        next(); // Call next() to proceed to the next middleware
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
        
    }
}
    