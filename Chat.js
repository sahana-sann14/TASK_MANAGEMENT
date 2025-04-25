import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';

// Set up socket connection
const socket = io('http://localhost:5000'); // Replace with your server URL

const Chat = ({ userId, isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch chat history from the server
    axios.get(`/api/messages/${userId}`).then((response) => {
      setMessages(response.data);
    });

    // Listen for incoming messages
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        userId,
        content: message,
        timestamp: new Date().toISOString(),
        sender: isAdmin ? 'admin' : 'user',
      };

      // Send the message to the server
      axios.post('/api/messages', newMessage).then(() => {
        socket.emit('sendMessage', newMessage); // Emit to server
        setMessage('');
      });
    }
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <ListGroup variant="flush">
        {messages.map((msg, index) => (
          <ListGroup.Item
            key={index}
            className={msg.sender === 'admin' ? 'bg-light' : 'bg-primary text-white'}
          >
            <strong>{msg.sender === 'admin' ? 'Admin' : 'User'}:</strong> {msg.content}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div ref={messagesEndRef} />
      <Form onSubmit={handleSendMessage}>
        <InputGroup>
          <Form.Control
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            required
          />
          <Button type="submit" variant="primary">
            Send
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default Chat;