const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  totalAmount: Number,
  status: { type: String, default: 'Processing' },
  paymentStatus: { type: String, default: 'Success' },
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
