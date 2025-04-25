import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/signup',
        {
          name: userName,
          email,
          password,
          role,
        },
        { withCredentials: true }
      );
      console.log('Signup Success:', res.data);
        navigate('/login');
         } catch (err) {
      console.error('Signup Error:',err);
      alert(err.response?.data?.message || 'Server Error');
    }
  };

  return (
    <div className="signup-container justify-content-center">
      <div className="signup-card p-4 shadow">
      <img src="/zidio-logo.png" alt="Zidio Logo" className="auth-logo mb-3" />
        <h3 className="text-center mb-4">Sign up for Zidio</h3>

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Select Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
