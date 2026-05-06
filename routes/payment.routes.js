const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { verifyPayment } = require("../controllers/payment.controller");

router.post("/verify", protect, verifyPayment);

module.exports = router;
