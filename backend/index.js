const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const { clerkMiddleware } = require('@clerk/express');
const orderRoutes = require('./routes/orders');


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Clerk-Session-Id'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(clerkMiddleware());
app.use('/orders', orderRoutes);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));