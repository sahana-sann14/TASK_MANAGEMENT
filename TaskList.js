import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
            <p>Reminder: {task.reminder ? new Date(task.reminder).toLocaleString() : 'No reminder set'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
