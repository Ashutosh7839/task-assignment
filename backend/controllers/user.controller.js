const User = require("../models/user.model");

// ✅ Get all users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view users" });
    }

    const users = await User.find().select("name email role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};