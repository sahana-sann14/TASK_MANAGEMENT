import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Modal } from 'react-bootstrap';
import TaskEdit from '../components/TaskEdit';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    deadline: '',
  });
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUsersAndTasks();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/admin/notifications', {
        withCredentials: true,
      });
      setNotificationCount(res.data.count);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        withCredentials: true,
      });
  
      if (res.status === 200) {
        alert('✅ Task Deleted Successfully');
        fetchUsersAndTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error('Task delete error:', error.response);
      alert('❌ Failed to delete task');
    }
  };

  const fetchUsersAndTasks = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/users', { withCredentials: true }),
        axios.get('http://localhost:5000/api/tasks', { withCredentials: true }),
      ]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert(err.response?.data?.message || 'Error fetching users or tasks');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', formData, {
        withCredentials: true,
      });
  
      if (res.status === 200 || res.status === 201) {
        alert('✅ Task Assigned Successfully');
        console.log('Submitting form Data:', formData);
      }
  
      // Reset the form after submitting
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        deadline: '',
      });
      fetchUsersAndTasks();  // Refetch the users and tasks
    } catch (error) {
      console.error('Task assign error:', error.response?.data || error.message);
      alert('❌ Failed to assign task');
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleEditSave = async (task) => {
    const { _id: taskId, title, description, assignedUser } = task;
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { title, description, assignedUser },
        { withCredentials: true }
      );
      console.log("Update success", response.data);
      fetchUsersAndTasks();  // Optionally, refetch tasks after editing
      setShowEditModal(false); 
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-3" style={{ marginLeft: '40px' }}>
        <div className="alert alert-info">
          🔔 You have <strong>{notificationCount}</strong> new task completions!
        </div>

        <h2 className="mb-4">🛠️ Admin Dashboard</h2>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text>{totalTasks}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <Card.Text>{completedTasks}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="warning" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Pending</Card.Title>
                <Card.Text>{pendingTasks}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Assign Task Form */}
        <form className="card p-4 shadow-sm mb-5" onSubmit={handleAssign}>
          <h4>📋 Assign New Task</h4>
          <Row>
            <Col md={4} className="mb-3">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={3} className="mb-3">
              <label>Assign To</label>
              <select
                className="form-control"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col md={3} className="mb-3">
              <label>Priority</label>
              <select
                className="form-control"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </Col>
            <Col md={4} className="mb-3">
              <label>Deadline</label>
              <input
                type="date"
                className="form-control"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={12} className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <button type="submit" className="btn btn-primary w-100 fs-5">
            Assign Task
          </button>
        </form>

        {/* Task Table */}
        <div className="card p-4 shadow-sm">
          <h4>🗂️ All Tasks</h4>
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Time Left</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const deadline = new Date(task.deadline);
                const now = new Date();
                const timeLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                const assignedUser =
                  typeof task.assignedTo === 'object'
                    ? task.assignedTo
                    : users.find((user) => user._id === task.assignedTo);

                return (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{assignedUser ? assignedUser.name : 'Unassigned'}</td>
                    <td>{task.priority}</td>
                    <td>{deadline.toLocaleDateString()}</td>
                    <td>{task.status || 'Pending'}</td>
                    <td>
                      {timeLeft > 0 ? (
                        `${timeLeft} day(s)`
                      ) : (
                        <span className="text-danger">⏰ Overdue</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditClick(task)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                         className="btn btn-sm btn-outline-danger"
                         onClick={() => handleDelete(task._id)}
                      >
                        🗑️ Delete
                     </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Edit Task Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTask && (
              <TaskEdit
                task={selectedTask}
                onSave={handleEditSave}
                onCancel={() => setShowEditModal(false)}
                users={users}
              />
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
