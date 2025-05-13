import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js'; // Import the connectDb function from db.js
import Razorpay from 'razorpay'; // Import Razorpay for payment processing
import cors from 'cors'; // Import CORS for handling cross-origin requests



dotenv.config(); // Load environment variables from .env file

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
});

const app = express();

//using middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes

const port = process.env.PORT || 5000; // Set the port to the value in .env or default to 5000  

app.get('/', (req, res) => {
    res.send('Hello World! Sakshams server is Running!');
});

app.use("/uploads", express.static("uploads")); // Serve static files from the "uploads" directory

//importing routes
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js'; 
import adminRoutes from './routes/admin.js';

//using routes
app.use('/api', userRoutes); // Use the user routes for API requests
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // Start the server on port 5000
    connectDb(); 
});