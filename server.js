// server.js
require("dotenv").config(); // MUST be first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");


// Middleware
const { protect } = require("./middleware/authMiddleware"); // ✅ named import

const app = express();

app.set("trust proxy", 1);

/* ===============================
   BASIC & SECURITY MIDDLEWARE
================================ */

// Parse JSON
app.use(express.json({ limit: "10kb" }));

// Secure headers
app.use(helmet());

// CORS
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   RATE LIMITING
================================ */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please try again later.",
  },
});

/* ===============================
   ROUTES
================================ */

// Auth (register, login, me)
app.use("/api/auth", authLimiter, authRoutes);

// Orders (create order, my-orders)
app.use("/api/orders", protect, orderRoutes);

// Payments (verify payment)
app.use("/api/payment", protect, paymentRoutes);

// Health / protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    ok: true,
    user: req.user,
  });
});
app.use('/api/admin', require('./routes/admin.routes'));

app.use("/api/contact", require("./routes/contact.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/admin", require("./routes/admin.products.routes"));
app.get("/", (req, res) => {
  res.send("API is running...");
});


/* ===============================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

/* ===============================
   DATABASE & SERVER START
================================ */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    


    


    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })

  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
