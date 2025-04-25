import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io('http://localhost:5000');

const UserChatRoom = ({ userId, adminId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const roomId = `admin-${adminId}-user-${userId}`;

  useEffect(() => {
    socket.emit('register', userId);
    socket.emit('joinRoom', roomId);

    axios.get(`http://localhost:5000/api/chats/${roomId}`).then(res => {
      setMessages(res.data);
    });

    socket.on('receiveMessage', (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [roomId, userId]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    // User receives messages in the chatroom
socket.on("receiveMessage", (data) => {
  if (data.roomId === `admin-${adminId}-user-${userId}`) {
    setMessages((prev) => [...prev, data]);
  }
});

    socket.emit('adminToUserMessage', {
      roomId: `admin-${adminId}-user-${userId}`,
      message,
      sender: 'User',
    });

    setMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mt-4">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#f0f0f0', background: '#f0f2f8' }}>
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Chat with Admin</h5>
        </div>

        <div
          className="card-body"
          style={{ height: '600px', overflowY: 'auto', backgroundColor: '#e5ddd5', padding: '10px' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${msg.sender === 'User' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === 'User' ? 'bg-success text-white' : 'bg-white text-dark'
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

export default UserChatRoom;
