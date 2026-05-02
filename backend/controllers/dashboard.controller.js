const Task = require("../models/task.model");

// ✅ Dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    let query = {};

    // Admin → all tasks
    if (req.user.role !== "admin") {
      query.assignedTo = userId;
    }

    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: "done" });
    const pending = await Task.countDocuments({
      ...query,
      status: { $ne: "done" }
    });

    const overdue = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};