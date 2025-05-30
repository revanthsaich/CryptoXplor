const { getAuth } = require('@clerk/express');

// Middleware to verify JWT token from Clerk
const protect = (req, res, next) => {
  console.log('=== Auth Middleware ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Auth Header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    // Clerk middleware should have already attached auth to req.auth
    const auth = req.auth || getAuth(req);
    console.log('Auth object:', JSON.stringify(auth, null, 2));
    
    const userId = auth?.userId || auth?.sessionClaims?.sub;
    console.log('Extracted userId:', userId);
    
    if (!userId) {
      console.error('❌ No user ID found in request');
      console.log('Request headers:', JSON.stringify(req.headers, null, 2));
      console.log('Session ID:', req.headers['clerk-session-id']);
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid or missing token',
        details: process.env.NODE_ENV === 'development' ? 'No user ID found in auth token' : undefined
      });
    }
    
    // Attach the userId to the request for use in route handlers
    req.userId = userId;
    console.log('✅ Authentication successful, userId:', userId);
    next();
  } catch (error) {
    console.error('❌ Authentication error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      headers: req.headers,
      auth: req.auth
    });
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const checkOwnership = async (req, res, next) => {
  try {
    const { userId } = req;
    const Order = require('../models/Order');
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.error('Error checking order ownership:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { protect, checkOwnership };