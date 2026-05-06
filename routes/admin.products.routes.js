const express = require("express");
const router = express.Router();

const ProductStock = require("../models/ProductStock");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ GET ALL PRODUCT STOCK (ADMIN)
router.get("/products", protect, adminMiddleware, async (req, res) => {
  const products = await ProductStock.find().sort({ slug: 1 });
  res.json({ success: true, data: products });
});

// ✅ UPDATE STOCK USING SLUG
router.put(
  "/products/:slug/stock",
  protect,
  adminMiddleware,
  async (req, res) => {
    const { inStock } = req.body;

    const product = await ProductStock.findOneAndUpdate(
      { slug: req.params.slug },
      { inStock },
      { new: true }
    );

    res.json({ success: true, data: product });
  }
);

module.exports = router;
