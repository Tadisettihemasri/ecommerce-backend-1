const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticateToken, requireAdmin } = require("../middleware/isAdmin");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes
router.post("/", authenticateToken, requireAdmin, productController.addProduct);
router.delete("/:id", authenticateToken, requireAdmin, productController.deleteProduct);


module.exports = router;
