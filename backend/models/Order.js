const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    coinId: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    selectedCurrency: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    totalCost: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    sellPrice: {
        type: Number,
        min: 0
    },
    pnl: {
        type: Number,
        default: 0
    },
    pnlPercentage: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total cost before saving
orderSchema.pre('save', function(next) {
    this.totalCost = this.type === 'buy' ? this.quantity * this.price : -1 * (this.quantity * this.price);
    next();
});

module.exports = mongoose.model('Order', orderSchema);
