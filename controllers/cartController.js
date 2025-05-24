const db = require("../models/db");

exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: "Missing userId or productId" });

  try {
    const productRes = await db.query("SELECT price FROM products WHERE id = $1", [productId]);
    if (productRes.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    const price = parseFloat(productRes.rows[0].price);

    const existingCart = await db.query(
      "SELECT * FROM carts WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (existingCart.rows.length > 0) {
      const currentQty = existingCart.rows[0].quantity;
      const newQty = currentQty + 1;
      const newTotal = newQty * price;

      await db.query(
        `UPDATE carts 
         SET quantity = $1, total = $2
         WHERE user_id = $3 AND product_id = $4`,
        [newQty, newTotal, userId, productId]
      );
    } else {
      await db.query(
        `INSERT INTO carts (user_id, product_id, quantity, total)
         VALUES ($1, $2, 1, $3)`,
        [userId, productId, price]
      );
    }

    res.json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCart = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const result = await db.query(`
      SELECT c.product_id, c.quantity, c.total, 
             p.name, p.description, p.brand, p.price, p.image_url 
      FROM carts c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: "Missing userId or productId" });

  try {
    await db.query(
      "DELETE FROM carts WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    res.json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};
