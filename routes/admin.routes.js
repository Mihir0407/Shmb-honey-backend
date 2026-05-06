const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const adminController = require('../controllers/admin.controller');
const ProductStock = require("../models/ProductStock");

router.get(
  '/stats',
  protect,
  adminMiddleware,
  adminController.getAdminStats
);

router.get(
  '/users',
  protect,
  adminMiddleware,
  adminController.getAllUsers
);

router.get(
  '/orders',
  protect,
  adminMiddleware,
  adminController.getAllOrders
);
router.delete(
  '/users/:id',
  protect,
  adminMiddleware,
  adminController.deleteUser
);

router.put(
  "/product-stock/:slug",
  protect,
  adminMiddleware,
  async (req, res) => {
    const { inStock } = req.body;

    const stock = await ProductStock.findOneAndUpdate(
      { slug: req.params.slug },
      { inStock },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, inStock: stock.inStock });
  }
);


module.exports = router;
