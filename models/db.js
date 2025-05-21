module.exports = {
  users: [],
  products: [
    {
      id: "p01",
      name: "iPhone 15",
      description: "Latest Apple smartphone with A16 Bionic chip",
      price: 1200,
      stock: 10,
      imageUrl: "https://example.com/iphone15.jpg"
    },
    {
      id: "p02",
      name: "Samsung Galaxy S23",
      description: "High-performance Android smartphone from Samsung",
      price: 1100,
      stock: 15,
      imageUrl: "https://example.com/galaxys23.jpg"
    }
  ],
  orders: [],
  carts: {} // userId -> [{ productId, quantity }]
};
