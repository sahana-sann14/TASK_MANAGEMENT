// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar'; // Import your sidebar component

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar /> {/* Sidebar will always be present */}
      <main className="content p-4" style={{ width: '100%' }}>
        {children} {/* Render the child components here */}
      </main>
    </div>
  );
};

export default Layout;
