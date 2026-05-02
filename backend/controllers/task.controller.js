const Task = require("../models/task.model");
const Project = require("../models/project.model");

// ✅ Create Task (Admin only)
exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can assign tasks" });
    }

    const { title, description, projectId, assignedTo, dueDate } = req.body;

    const project = await Project.findById(projectId);

    // ✅ check project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ fix ObjectId comparison
    const isMember = project.members.some(
      (member) => member.toString() === assignedTo
    );

    if (!isMember) {
      return res.status(400).json({ message: "User not in project" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Get Tasks (based on role)
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id });
    }

    res.json(tasks);

  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ✅ Update Task Status (Member)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // only assigned user can update
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = status;   
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json(err.message);
  }
};