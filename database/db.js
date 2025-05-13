import mongoose from "mongoose"; 

export const connectDb = async () => {
  try {
     await mongoose.connect(process.env.DB);
     console.log("Database MongoDB connected successfully!"); // Log success message
     
    } catch (error) {
    console.log(error);
    }
  } 
 // Connect to MongoDB using the connection string from .env file
// and log the connection status. If there's an error, log it and exit the process.
