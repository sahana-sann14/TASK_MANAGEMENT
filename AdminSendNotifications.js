// AdminSendNotification.js
import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

const AdminSendNotification = () => {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  const handleSend = () => {
    if (userId && message.trim() !== '') 
        {
          socket.emit('send-notification', { userId, message });
          setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Send Notification to Users</h4>
      <div className="input-group">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <div className='input-group'>
            <input
               type='text'
               className='form-control'
               placeholder='Enter notification message'
               onChange={(e) => setMessage(e.target.value)}
               />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

export default AdminSendNotification;