const Razorpay = require("razorpay");
const Order = require("../models/Order");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { items, billing, orderNotes, amount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user.id,
      items,
      billing,
      orderNotes: orderNotes || "",
      amount,
      razorpay: {
        orderId: razorpayOrder.id,
      },
    });

    res.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }console.log("FULL BODY:", req.body);
console.log("BILLING:", billing);

};

// ✅ UPDATE DELIVERY STATUS (ADMIN)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryStatus = status;
    await order.save();

    res.json({
      success: true,
      message: "Delivery status updated",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

