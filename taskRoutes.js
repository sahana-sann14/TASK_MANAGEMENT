const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authMiddleware, isAdmin, verifyToken } = require('../middleware/authMiddleware');

// ✅ Controllers
const {
  getAllTasks,
  getTasks,
  getAdminNotifications,
  updateTask,
  assignTask,
  updateTaskStatus,
  getTaskProgress,
  createTask,
  getNotifications,
  markNotificationAsRead,
  notifyAdmin,
  getTasksForUser
} = require('../controllers/taskController');

router.get('/', getAllTasks); 

router.post("/", assignTask); // For POST /api/tasks

// Admin: Get all tasks
router.get('/tasks', authMiddleware, (req, res, next) => {
  console.log('GET /tasks handler');
  getTasks(req, res, next);
});

// PUT /api/tasks/:id
router.put('/:id', updateTask);

// Dashboard: Task progress statistics
router.get('/progress', authMiddleware, getTaskProgress);

// User: Get tasks assigned to logged-in user
router.get('/user', authMiddleware, getTasksForUser);

// Create a new task (admin)
// 🔒 Secure it
router.post('/', authMiddleware, isAdmin, createTask);

// Admin-only route
router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

router.post('/api/tasks', createTask);

// Inline edit a task
router.put('/:id', authMiddleware, updateTask);

// Update only the task status AND notify admin if completed
router.put('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    // Update task status
    const response = await updateTaskStatus(req, res);

    // Notify admin only if status is "Completed"
    const { status } = req.body;
    if (status === 'Completed') {
      await notifyAdmin(req, res);
    }

    return response; // Return the task status update response
  } catch (error) {
    next(error); // Pass error to the next middleware (error handler)
  }
});

// Notify admin manually (optional route)
router.post('/notifications/notify-admin', authMiddleware, isAdmin, notifyAdmin);

// User: Get personal notifications
router.get('/notifications', authMiddleware, getNotifications);

// Admin: Mark notification as read
router.put('/admin/notifications/:id/read', authMiddleware, isAdmin, markNotificationAsRead);

// Admin: Get all user completion notifications
router.get('/admin/notifications', getAdminNotifications);

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});


module.exports = router;
