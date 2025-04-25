const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

const getProgressReport = async (req, res) => {
  try {
    const { user } = req.query;

    // Base query: all tasks or by user
    const query = user ? { assignedTo: user } : {};

    const tasks = await Task.find(query).populate('assignedTo', 'name');

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;

    // 🔢 Tasks by User
    const tasksByUserMap = {};
    tasks.forEach(task => {
      const name = task.assignedTo?.name || 'Unassigned';
      if (!tasksByUserMap[name]) {
        tasksByUserMap[name] = { name, pending: 0, inProgress: 0, completed: 0 };
      }
      if (task.status === 'Pending') tasksByUserMap[name].pending += 1;
      else if (task.status === 'In Progress') tasksByUserMap[name].inProgress += 1;
      else if (task.status === 'Completed') tasksByUserMap[name].completed += 1;
    });

    const tasksByUser = Object.values(tasksByUserMap);

    // 📈 Task Trend by Date
    const trendMap = {};
    tasks.forEach(task => {
      const dateKey = new Date(task.createdAt).toISOString().split('T')[0];
      if (!trendMap[dateKey]) {
        trendMap[dateKey] = { date: dateKey, pending: 0, inProgress: 0, completed: 0 };
      }
      if (task.status === 'Pending') trendMap[dateKey].pending += 1;
      else if (task.status === 'In Progress') trendMap[dateKey].inProgress += 1;
      else if (task.status === 'Completed') trendMap[dateKey].completed += 1;
    });

    const trend = Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Report data:", {
      totalTasks,
  pendingTasks,
  inProgressTasks,
  completedTasks,
  tasksByUser,
  trend
});
    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      tasksByUser,
      trend
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to fetch progress report' });
  }
};

module.exports = {
  getProgressReport
};
