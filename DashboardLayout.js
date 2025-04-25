import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserSidebar from './UserSidebar';
import AdminSidebar from './AdminSidebar';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  console.log("DashboardLayout rendering. User role:", user?.role);

  const renderSidebar = () => {
    if (user?.role === 'Admin') return <AdminSidebar />;
    if (user?.role === 'User') return <UserSidebar />;
    return null;
  };

  return (
    <div className="d-flex">
      {renderSidebar()}
      <div className="flex-grow-1 p-4" style={{ minHeight: '100vh', background: '#f9f9f9' }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
