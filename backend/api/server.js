const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const { clerkMiddleware } = require('@clerk/express');
const orderRoutes = require('../routes/orders');
const coinRoutes = require('../routes/coins');
const marketRoutes = require('../routes/market');

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'https://cryptoxplor.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Clerk-Session-Id'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/orders', orderRoutes);
app.use('/coins', coinRoutes);
app.use('/market', marketRoutes);

// MongoDB connection with async/await
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Start server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();

module.exports = app;
