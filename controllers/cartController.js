const db = require("../models/db");

exports.addToCart = (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: "Missing userId or productId" });

  db.carts[userId] = db.carts[userId] || [];
  const cart = db.carts[userId];

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  res.json({ message: "Product added to cart" });
};

exports.getCart = (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const cartItems = db.carts[userId] || [];
  const detailed = cartItems.map(item => {
    const product = db.products.find(p => p.id === item.productId);
    return product ? { ...item, ...product } : null;
  }).filter(Boolean);

  res.json(detailed);
};

exports.removeFromCart = (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: "Missing userId or productId" });

  const cart = db.carts[userId] || [];
  db.carts[userId] = cart.filter(item => item.productId !== productId);

  res.json({ message: "Product removed from cart" });
};
