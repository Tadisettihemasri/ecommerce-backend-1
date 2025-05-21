const db = require("../models/db");

exports.createOrder = (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const cart = db.carts[userId] || [];
  if (!cart.length) return res.status(400).json({ error: "Cart is empty" });

  const order = {
    id: `order-${Date.now()}`,
    userId,
    items: [...cart], // preserve quantity and productId
    status: "Success",
    timestamp: new Date()
  };

  db.orders.push(order);
  db.carts[userId] = []; // clear cart after order

  res.status(201).json({ message: "Order placed", order });
};

exports.getUserOrders = (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const orders = db.orders.filter(o => o.userId === userId);
  const start = (page - 1) * limit;
  const paginated = orders.slice(start, start + +limit);

  res.json({ orders: paginated });
};
