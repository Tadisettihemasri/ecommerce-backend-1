const db = require("../models/db");

exports.createOrder = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    // 1. Get cart items
    const cartRes = await db.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
    const cartItems = cartRes.rows;

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Create order
    const orderRes = await db.query(
      "INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id, created_at",
      [userId, "Success"]
    );
    const orderId = orderRes.rows[0].id;

    // 3. Insert all items into order_items
    const itemPromises = cartItems.map(item => {
      return db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.total / item.quantity]
      );
    });

    await Promise.all(itemPromises);

    // 4. Clear cart
    await db.query("DELETE FROM carts WHERE user_id = $1", [userId]);

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};

exports.getUserOrders = async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const offset = (page - 1) * limit;

    // 1. Get orders
    const ordersRes = await db.query(
      `SELECT id AS order_id, status, created_at
       FROM orders WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const orders = ordersRes.rows;

    // 2. Attach order items to each order
    for (const order of orders) {
      const itemsRes = await db.query(
        `SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.order_id]
      );
      order.items = itemsRes.rows;
    }

    res.json({ orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
