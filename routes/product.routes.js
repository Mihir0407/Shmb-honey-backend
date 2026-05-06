const express = require("express");
const router = express.Router();
const ProductStock = require("../models/ProductStock");

// GET ALL PRODUCT STOCK
router.get("/stock", async (req, res) => {
  const stocks = await ProductStock.find({});
  const stockMap = {};

  stocks.forEach(p => {
    stockMap[p.slug] = p.inStock;
  });

  res.json(stockMap);
});


module.exports = router;
