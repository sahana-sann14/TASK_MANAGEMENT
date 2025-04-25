import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';

import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UserMeetingRoom from './components/UserMeetingRoom'
import UserChatRoom from './components/UserChatRoom';

import UserProfile from './pages/UserProfile';
import UserNotifications from './pages/UserNotifications';
import TaskProgress from './pages/admin/TaskProgress';

import ManageTasks from './pages/admin/ManageTasks';
import TeamMembers from './components/TeamMembers';
import AdminChat from './pages/AdminChat';
import AdminMeetingRoom from './components/AdminMeetingRoom';
import AddTeamMember from './components/AddTeamMember';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin Dashboard Route */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminDashboard tasks={tasks} addTask={addTask} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Additional Admin Pages (Sidebar Routes) */}
            <Route
              path="/admin-dashboard/tasks"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageTasks />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/team"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <TeamMembers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/admin-dashboard/team/add" element={<AddTeamMember />}
            />

            <Route
              path="/admin/chat"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  
                    <AdminChat />
                  
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/progress-report"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <TaskProgress />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/meeting"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminMeetingRoom />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* User Dashboard Route */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <DashboardLayout>
                    <UserDashboard tasks={tasks} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

           <Route
              path="/user/chatroom"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <DashboardLayout>
                    <UserChatRoom />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Profile and Notification Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/notifications"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <DashboardLayout>
                    <UserNotifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/user-meeting" element={<UserMeetingRoom />} />

            {/* Global Task Progress View */}
            <Route path="/progress-report" element={<TaskProgress />} />

            {/* Unauthorized Fallback */}
            <Route path="/unauthorized" element={<h3 className="text-center mt-5">Unauthorized - Access Denied</h3>} />
          
            <Route path="/admin-dashboard/settings" element={<Settings />} />

          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>

  );
}

export default App;
