import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const AdminChatRoom = ({ adminId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const roomId = `admin-${adminId}-user-${userId}`;

  useEffect(() => {
    socket.emit('register', adminId);
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [roomId, adminId]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    socket.emit('adminToUserMessage', {
      roomId: `admin-${adminId}-user-${userId}`,
      message: message,
      sender: 'Admin'
    });

    setMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mt-6 ">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#f0f0f0' }}>
        <div className="card-header bg-primary text-white">
          <h5 className="mb-3 text-center">Chat with User {userId}</h5>
        </div>

        <div
          className="card-body"
          style={{ height: '700px', overflowY: 'auto', backgroundColor: '#e5ddd5', padding: '10px' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${msg.sender === 'Admin' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === 'Admin' ? 'bg-primary text-white' : 'bg-white text-dark'
                }`}
                style={{ maxWidth: '70%' }}
              >
                <small><strong>{msg.sender}</strong></small>
                <div>{msg.message}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="card-footer d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="btn btn-success" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatRoom;
