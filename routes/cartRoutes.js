const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addToCart);
router.get("/", cartController.getCart);
router.delete("/", cartController.removeFromCart);

module.exports = router;
