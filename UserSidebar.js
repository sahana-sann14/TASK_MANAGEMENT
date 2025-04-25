import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import io from 'socket.io-client';

const UserSidebar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuthContext(); // Get logged-in user

  useEffect(() => {
    const socket = io('http://localhost:5000');

    if (user?.id) {
      socket.emit('register', user._id); // Register user ID to receive personal notifications
    }

    socket.on('notification', (data) => {
      setNotifications((prev) => [...prev, data.message]);
      setLatestNotification(data.message);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });

    return () => socket.disconnect();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '250px' }}>
      <h4 className="mb-4 fw-bold text-center">👨‍🔧User Panel</h4>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/user-dashboard" className="text-white fw-bold px-4 py-4 m-0 ">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/user/chatroom" className="text-white fw-bold px-4 py-4 m-0 ">Chat Room</Nav.Link>
        <Nav.Link as={Link} to="/user-meeting" className="text-white fw-bold px-4 py-4 m-0 ">Meeting Room</Nav.Link>
        <Nav.Link as={Link} to="/profile" className="text-white fw-bold px-4 py-4 m-0 ">Profile</Nav.Link>

        <div className="mt-auto px-4 py-4 m-0 border-top border-white border-opacity-25"></div>
        <button onClick={handleLogout} className="btn btn-danger w-100 fw-semibold">
          Logout
        </button>
      </Nav>

      {/* Toast Notification */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          className={`toast bg-info text-white ${showToast ? 'show' : 'hide'}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">New Notification</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">{latestNotification}</div>
        </div>
      </div>

      {/* Live Notifications */}
      <div className="mt-4">
        <h6>Live Notifications:</h6>
        <ul className="list-unstyled">
          {notifications.map((notification, index) => (
            <li key={index} className="text-light">{notification}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;