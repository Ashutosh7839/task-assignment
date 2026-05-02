const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/user.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/", authMiddleware, getUsers);

module.exports = router;