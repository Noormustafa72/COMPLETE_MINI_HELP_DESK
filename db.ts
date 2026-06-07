import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miniticketdb';

/* ================= Database Connection ================= */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);

    // Stop server if DB fails (important for API reliability)
    process.exit(1);
  }
};

/* ================= Optional: Connection Events ================= */
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('🟡 Mongoose disconnected');
});