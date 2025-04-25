import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './UserSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const tasksPerPage = 5;

  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks/user', {
        headers: { 'x-auth-token': token },
      });
      const fetchedTasks = res.data;
      setTasks(fetchedTasks);

      // Update task statistics
      const completed = fetchedTasks.filter(task => task.status === 'Completed').length;
      const pending = fetchedTasks.filter(task => task.status === 'Pending').length;
      setTaskStats({
        total: fetchedTasks.length,
        completed,
        pending,
      });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  useEffect(() => {
    tasks.forEach(task => {
      const deadlineDate = new Date(task.deadline);
      const now = new Date();
      const timeRemaining = deadlineDate - now;
      if (timeRemaining <= 86400000) { // Notify if 24 hours left
        toast.info(`Task "${task.title}" is due in 24 hours!`);
      }
    });
  }, [tasks]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedTasks = filteredTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (taskId, status) => {
    try {
      const token = localStorage.getItem('token');
  
      // Update the task status
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, {
        status,
      }, {
        headers: { 'x-auth-token': token },
      });
  
      toast.success(`Task marked as ${status}`);
  
      // If status is "Completed", notify the admin
      if (status === "Completed") {
        await axios.post(`http://localhost:5000/api/notifications/notify-admin`, {
          taskId,
        }, {
          headers: { 'x-auth-token': token },
        });
  
        toast.info("Admin has been notified of your task completion!");
      }
  
      // Refresh tasks
      fetchUserTasks();
  
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update task status.");
    }
  };
  
  const calculateRemainingTime = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeRemaining = deadlineDate - now;
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? `${daysRemaining} day(s) left` : 'Due today!';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge bg-success">Completed</span>;
      case 'In Progress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      case 'Pending':
      default:
        return <span className="badge bg-secondary">Pending</span>;
    }
  };

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayedTasks = searchedTasks.slice(pageNumber * tasksPerPage, (pageNumber + 1) * tasksPerPage);

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f0f4f8', borderRight: '1px solid #dee2e6' }} className="shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <h2 className="mb-4 text-black fw-bold">📋 Your Assigned Tasks</h2>

        {/* Task Summary */}
        <div className="mb-4 d-flex justify-content-between">
          <div className="alert p-4 text-center" style={{
            fontSize: '1.2rem', height: '170px', width: '25vw', background: 'linear-gradient(45deg,rgb(217, 235, 54),rgb(50, 70, 187))', color: '#fff', borderRadius: '10px'
          }}>
            <strong>Total Tasks:</strong> {taskStats.total}
          </div>
          <div className="alert w-40 p-4 text-center" style={{
            fontSize: '1.2rem', height: '170px', width: '25vw', background: 'linear-gradient(45deg,rgba(31, 252, 31, 0.86),rgb(40, 60, 179))', color: '#fff', borderRadius: '10px'
          }}>
            <strong>Completed:</strong> {taskStats.completed}
          </div>
          <div className="alert w-40 p-4 text-center" style={{
            fontSize: '1.2rem', height: '170px', width: '25vw', background: 'linear-gradient(45deg,rgb(231, 178, 17),rgb(236, 154, 30))', color: '#fff', borderRadius: '10px'
          }}>
            <strong>Pending:</strong> {taskStats.pending}
          </div>
        </div>

        {/* Filter & Search */}
        <div className="mb-4 d-flex justify-content-between">
          <select className="form-select w-25" value={filter} onChange={handleFilterChange}>
            <option value="All">All Tasks</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Task Cards */}
        {displayedTasks.length === 0 ? (
          <div className="alert alert-info">No tasks assigned yet.</div>
        ) : (
          <div className="row">
            {displayedTasks.map((task) => (
              <div key={task._id} className="col-sm-12 col-md-8 col-lg-4 mb-4">
                <div className="card shadow-lg h-100 border-0" style={{ backgroundColor: '#f0f0ff' }}>
                  <div className="card-body" style={{ backgroundColor: '#e3f2fd', borderRadius: '10px' }}>
                    <h5 className="card-title" style={{ color: '#3e4a61' }}>{task.title}</h5>
                    <p className="text-muted small mb-2">{task.description}</p>

                    <div className="mb-2">
                      {getStatusBadge(task.status)}
                    </div>

                    <p className="mb-1">
                      <strong>Deadline:</strong><br />
                      <span className="text-danger">{calculateRemainingTime(task.deadline)}</span>
                    </p>
                    <p className="mb-0">
                      <strong>Priority:</strong> {task.priority || 'Normal'}
                    </p>
                  </div>

                  <div className="card-footer bg-transparent border-0 d-flex justify-content-end" style={{ backgroundColor: '#e3f2fd' }}>
                    <select className="form-select" onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          pageCount={Math.ceil(searchedTasks.length / tasksPerPage)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
        />
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default UserDashboard;
