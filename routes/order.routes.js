const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");



const {
  createOrder,
  updateDeliveryStatus,
} = require("../controllers/order.controller");

router.post("/", createOrder);
// ✅ USER: MY ORDERS
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await require("../models/Order")
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("My orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ ADMIN: UPDATE DELIVERY STATUS
router.put(
  "/:id/delivery",
  protect,
  adminMiddleware,
  updateDeliveryStatus
);

module.exports = router;
