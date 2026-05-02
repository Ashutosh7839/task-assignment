const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const authRoutes = require("./routers/auth.route");
const taskRoutes = require("./routers/task.route");
const projectRoutes = require("./routers/project.route");
const dashboardRoutes = require("./routers/dashboard.route");
const userRoutes = require("./routers/user.route");

app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));