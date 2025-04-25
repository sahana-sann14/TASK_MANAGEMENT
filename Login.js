import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate (React Router v6)
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext'; // Adjust path if needed
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role
  const navigate = useNavigate();  // Correct usage of useNavigate

  const { setAuth } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
          role,
        },
        { withCredentials: true }
      );

      const { token, user } = res.data;
      const userRole = user.role.toLowerCase();

      // Save token and role to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); 

      // Update the auth context (if using it for global state)
      setAuth({ token, user });
      console.log("Logged in user:", user);
      console.log("Stored token:", token);


      // Redirect based on user role
      if (userRole === 'admin') {
        navigate('/admin-dashboard');  // Redirect to admin dashboard
      } else {
        navigate('/user-dashboard');  // Redirect to user dashboard
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="card login-card shadow-lg p-5">
        <div className="text-center mb-4">
          <img src="/zidio-logo.png" alt="Zidio Logo" className="auth-logo mb-3" />
          <h3 className="text-primary">Login to Zidio</h3>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Select Role</label>
            <select
              className="form-select form-select-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">Login</button>
          </div>
        </form>

        <p className="mt-4 text-center">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
