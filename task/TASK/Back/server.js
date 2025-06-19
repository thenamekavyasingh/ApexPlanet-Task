const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/taskmng";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, default: "Low" },
  assignee: { type: String },
  dueDate: { type: String },
  tags: { type: [String] },
  status: { type: String, default: "To Do" },
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = new Task(taskData);
    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save task", error: err });
  }
});

// Fetch all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks", error: err });
  }
});

// Update task status
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ success: true, task: updatedTask });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update task", error: err });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete task", error: err });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
