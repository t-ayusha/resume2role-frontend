import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('WARNING: MONGO_URI is not defined in .env file. Running in in-memory mode.');
}

export const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI not configured');
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
