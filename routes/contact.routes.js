const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  submitContactForm,
  getAllMessages,
} = require("../controllers/contact.controller");

router.post("/", submitContactForm);

// admin only
router.get("/", protect, adminMiddleware, getAllMessages);

module.exports = router;
