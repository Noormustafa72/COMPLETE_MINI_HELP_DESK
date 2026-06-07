import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ticketRoutes from './routes/tickets';
import { connectDatabase } from './db';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

/* ================= Middleware ================= */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ================= Routes ================= */
app.use('/tickets', ticketRoutes);

/* ================= 404 Handler ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ================= Global Error Handler ================= */
app.use(errorHandler);

/* ================= Server Start ================= */
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('MongoDB Connected Successfully');

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

/* ================= Safety: Unhandled Errors ================= */
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  process.exit(1);
});