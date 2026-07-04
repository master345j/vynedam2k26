import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/earth_db';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      autoIndex: true, // Ensure indexes are built (useful for unique bounds)
    });
    console.log(`\x1b[32m[Database]\x1b[0m MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\x1b[31m[Database] Connection Error:\x1b[0m ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('\x1b[33m[Database]\x1b[0m MongoDB Disconnected');
  } catch (error) {
    console.error(`\x1b[31m[Database] Disconnection Error:\x1b[0m ${error.message}`);
  }
};
