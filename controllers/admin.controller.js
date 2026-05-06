const User = require('../models/User');
const Order = require('../models/Order');

/* ===============================
   ADMIN DASHBOARD STATS
================================ */
exports.getAdminStats = async (req, res) => {
  try {
    // 🔒 Extra safety
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const [totalUsers, totalOrders, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        users: totalUsers,
        orders: totalOrders,
        revenue: revenueAgg[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
};

/* ===============================
   ALL USERS (ADMIN)
================================ */
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const users = await User.find()
      .select('-password')
      .lean();

    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/* ===============================
   ALL ORDERS (ADMIN)
================================ */
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safety: never delete admin
    if (user.role === 'admin') {
      return res
        .status(400)
        .json({ message: "Cannot delete admin user" });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
