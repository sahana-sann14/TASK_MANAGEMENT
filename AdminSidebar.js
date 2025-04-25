// src/components/AdminSidebar.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Trigger animation on mount
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin-dashboard/team', label: 'Team Members' },
    { path: '/admin/chat', label: 'ChatRoom' },
    { path: '/admin-dashboard/progress-report', label: 'Task Progress' },
    { path: '/admin-dashboard/meeting', label: 'Meeting Room' },
    { path: '/admin-dashboard/settings', label: 'Settings' },
  ];

  return (
    <div
      className={`admin-sidebar d-flex flex-column bg-primary text-white vh-auto`}
      style={{
        width: '260px',
        transform: animate ? 'translateX(0)' : 'translateX(-100%)',
        opacity: animate ? 1 : 0,
        transition: 'all 0.4s ease-in-out',
        textAlign: 'left',
      }}
    >
      <h4 className="fw-bold px-4 py-4 m-0 border-bottom fs-4">Admin Dashboard</h4>

      <ul className="nav flex-column w-100">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link fs-5 text-white px-4 py-3 w-100 fw-semibold ${
                location.pathname === item.path ? 'bg-white bg-opacity-10 rounded-end' : ''
              }`}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto px-4 py-3 border-top border-white border-opacity-25">
        <button onClick={handleLogout} className="btn btn-danger w-100 fw-semibold">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;