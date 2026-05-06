const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: String,
        title: String,
        price: Number,
        qty: Number,
      },
    ],

    billing: {
      firstName: String,
      lastName: String,
      address1: String,
      city: String,
      state: String,
      zip: String,
      email: String,
      phone: String,
    },

    orderNotes: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["created", "confirmed", "shipped", "delivered"],
      default: "created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
