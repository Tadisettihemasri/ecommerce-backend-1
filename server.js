const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../ecommerce-app")));

require("dotenv").config();
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/users", userRoutes);  
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});



