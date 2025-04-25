import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setTask(res.data);
      } catch (error) {
        console.error('Failed to fetch task details:', error);
      }
    };

    fetchTaskDetails();
  }, [id]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h3>{task.title}</h3>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <button className="btn btn-secondary" onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
};

export default TaskDetails;
