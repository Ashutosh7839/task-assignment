const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus
} = require("../controllers/task.controller");

const authMiddleware = require("../auth/auth.middleware");
// const authMiddlewarre = require("../auth/auth.middleware");

// create task
router.post("/", authMiddleware, createTask);

// get tasks
router.get("/", authMiddleware, getTasks);

// update status
router.put("/:id", authMiddleware, updateTaskStatus);

module.exports = router;