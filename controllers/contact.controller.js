const ContactMessage = require("../models/ContactMessage");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
