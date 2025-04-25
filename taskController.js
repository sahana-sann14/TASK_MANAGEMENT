const Task = require('../models/Task');
const cron = require('node-cron');
const Notification = require('../models/Notification');

const assignTask = async (req, res) => {
  try {
    const { title, assignTo, priority, deadline, description } = req.body;

    // Validate required fields
    if (!title || !assignTo || !priority || !deadline || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = new Task({
      title,
      assignTo,
      priority,
      deadline,
      description,
      status: "Pending", // default status
    });

    await newTask.save();

    res.status(201).json({ message: "Task assigned successfully", task: newTask });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ message: "Failed to assign task", error });
  }
};

// 🔔 Schedule a reminder (logs to console for now)
const scheduleReminder = (task) => {
  const reminderTime = task.reminder;
  if (reminderTime) {
    cron.schedule(reminderTime, () => {
      console.log(`Reminder: Task "${task.title}" is due soon!`);
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

// Notify admin about task completion
const notifyAdmin = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId).populate('assignedTo');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const message = `User ${task.assignedTo.name} has completed task "${task.title}".`;

    const notification = await Notification.create({
      message,
      recipientRole: 'Admin',
      type: 'Task Completion',
      createdAt: new Date(),
    });

    // Real-time notify
    const io = req.app.get('io');
    io.emit('adminNotification', notification);

    res.status(200).json({ message: 'Admin notified successfully' });
  } catch (err) {
    console.error('Notify admin error:', err);
    res.status(500).json({ message: 'Failed to notify admin' });
  }
};

// 📊 Get task progress for charts/dashboard
const getTaskProgress = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'Completed' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const pending = await Task.countDocuments({ status: 'Pending' });
    const now = new Date();

    const overdue = await Task.countDocuments({
      deadline: { $exists: true, $lt: now },
      status: { $ne: 'Completed' },
    });

    res.json({
      total,
      completed,
      inProgress,
      overdue,
      pending,
    });
  } catch (error) {
    console.error('Error fetching task progress:', error);
    res.status(500).json({ error: 'Failed to fetch task progress' });
  }
};


// 📝 Get all tasks (admin)
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id; // comes from JWT middleware
    const role = req.user.role;

    let tasks;

    if (role === 'admin') {
      tasks = await Task.find(); // Admin can see all tasks
    } else {
      tasks = await Task.find({ assignedTo: userId }); // User sees only their tasks
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// 👤 Get tasks for the logged-in user
const getTasksForUser = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Failed to fetch user tasks' });
  }
};

// ✅ Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, reminder, assignedTo, priority } = req.body;

    const newTask = new Task({
      title,
      description,
      deadline,
      reminder,
      assignedTo,
      priority,
    });

    await newTask.save();

    // Schedule reminder
    scheduleReminder(newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// ✏️ Update task details
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline } = req.body;
    const taskId = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, priority, deadline },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// 🔔 Admin notifications for review
const getAdminNotifications = async (req, res) => {
  try {
    const { type, unreadOnly } = req.query;

    const filter = { recipientRole: 'Admin' };

    if (type) filter.type = type;
    if (unreadOnly === 'true') filter.isRead = false;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching admin notifications:', err);
    res.status(500).json({ message: 'Error fetching admin notifications' });
  }
};

// 🛎️ User notifications (completed tasks)
const getNotifications = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'Completed', notifiedToAdmin: false });
    res.status(200).json({ count: tasks.length });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Error getting notifications' });
  }
};

module.exports = {
  getTasks,
  getTaskProgress,
  createTask,
  assignTask,
  updateTask,
  updateTaskStatus,
  markNotificationAsRead,
  notifyAdmin,
  getAllTasks,
  getAdminNotifications,
  getNotifications,
  getTasksForUser,
};
