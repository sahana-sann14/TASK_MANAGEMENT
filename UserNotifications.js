import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000');
const UserNotifications = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      socket.emit('register', user.id);
    }

    socket.on('receive-message', ({ fromUserId, message }) => {
      setMessages((prev) => [...prev, { from: fromUserId, text: message }]);
    });

    return () => socket.disconnect();
  }, [user]);

  const handleSend = () => {
    if (!user || !user.id) {
      console.error('User is not loaded or missing ID');
      return;
    }

    if (inputMessage.trim()) {
      socket.emit('send-message', {
        toUserId: 'admin123',
        fromUserId: user.id,
        message: inputMessage
      });

      setMessages((prev) => [...prev, { from: user.id, text: inputMessage }]);
      setInputMessage('');
    }
  };

  if (!user || !user.id) {
    return <div className="text-center mt-4">Loading user...</div>;
  }

  return (
    <div className="container mt-4">
      <h4>Messages with Admin</h4>
      <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-white p-2 rounded ${msg.from === user.id ? 'bg-primary text-end' : 'bg-secondary text-start'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-group mt-3">
        <input
          className="form-control"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default UserNotifications;