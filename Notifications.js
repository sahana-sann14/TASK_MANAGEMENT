// Notifications.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Card, Button, Badge } from 'react-bootstrap';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await axios.get('/notifications');
    console.log("Fetched notifications:", res.data);
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await axios.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await axios.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  return (
    <div className="container mt-4">
      <h3>Notifications</h3>
      {notifications.map((n) => (
        <Card key={n._id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>
              {n.message}
              {!n.isRead && <Badge bg="warning" className="ms-2">New</Badge>}
            </Card.Title>
            <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
            <div className="mt-2">
              {!n.isRead && <Button size="sm" variant="success" onClick={() => markAsRead(n._id)}>Mark as Read</Button>}
              <Button size="sm" variant="danger" className="ms-2" onClick={() => deleteNotification(n._id)}>Delete</Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Notifications;