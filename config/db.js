import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    
    console.log(`✅ MongoDB connected successfully: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectToDB;
