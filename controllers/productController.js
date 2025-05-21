const db = require("../models/db");


exports.getAllProducts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  const paginated = db.products.slice(start, start + +limit);
  res.json({ products: paginated, total: db.products.length, page: +page, limit: +limit });
};

exports.getProductById = (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({ error: "Product not found" });
};
