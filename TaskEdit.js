// TaskEdit.js
import React, { useState, useEffect } from 'react';

const TaskEdit = ({ task, onSave, onCancel, users }) => {
  const [taskData, setTaskData] = useState({ ...task });

  // Update taskData whenever the task prop changes
  useEffect(() => {
    setTaskData({ ...task });
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(taskData); // Call onSave to pass the updated task data
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          name="title"
          value={taskData.title || ''}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={taskData.description || ''}
          onChange={handleChange}
          className="form-control"
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label>Assigned User</label>
        <select
          name="assignedUser"
          value={taskData.assignedUser || ''}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskEdit;
