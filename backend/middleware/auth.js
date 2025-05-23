const { getAuth, requireAuth } = require('@clerk/express');

const protect = requireAuth();

const checkOwnership = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
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
