// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  brand: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: String
});

module.exports = mongoose.model("Product", productSchema);
