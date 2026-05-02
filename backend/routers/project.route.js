const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  addMember,
  removeMember,
  updateProject
} = require("../controllers/project.controller");

const authMiddleware = require("../auth/auth.middleware");

// ✅ Create Project (Admin only)
router.post("/", authMiddleware, createProject);

// ✅ Get Projects (for logged-in user)
router.get("/", authMiddleware, getProjects);

// ✅ Add Member (Admin only)
router.put("/add-member", authMiddleware, addMember);

// ✅ Remove Member (optional)
router.put("/remove-member", authMiddleware, removeMember);
router.put("/:id", authMiddleware, updateProject);
module.exports = router;