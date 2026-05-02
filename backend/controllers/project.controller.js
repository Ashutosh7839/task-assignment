const Project = require("../models/project.model");
const User = require("../models/user.model");

// ✅ Create Project (Admin only)
exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create project" });
    }

    const { name, description, members } = req.body;

  const project = await Project.create({
  name,
  description,
  createdBy: req.user.id,
  members: [req.user.id, ...members] // 👈 include selected users
});

    res.status(201).json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ Get all projects for logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(projects);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};// ✅ Add member (Admin only)
exports.addMember = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // check if already member
    const alreadyMember = project.members.some(
      (member) => member.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ Remove member (Admin only)
exports.removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can remove members" });
    }
    const project = await Project.findById(projectId);

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ Update Project (Admin only)
exports.updateProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update project" });
    }

    const { name, description } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};