const db = require("../models/db");


exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Get total count
    const countResult = await db.query("SELECT COUNT(*) FROM products");
    const total = parseInt(countResult.rows[0].count);

    // Get paginated products
    const result = await db.query(
      "SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      products: result.rows,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [productId]);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, brand, price, stock, image_url } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.query(
      `INSERT INTO products (name, description, brand, price, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, brand, price, stock, image_url]
    );
    res.status(201).json({ message: "Product added", product: result.rows[0] });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted", product: result.rows[0] });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
