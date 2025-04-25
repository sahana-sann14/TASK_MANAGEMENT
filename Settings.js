import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    notifications: true,
  });

  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');

  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/admin/profile');
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: '', // Reset password field on load
          notifications: res.data.notifications !== undefined ? res.data.notifications : true,
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setMessage('Failed to load profile data.');
        setVariant('danger');
      }
    };
    fetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/admin/profile', formData);
      console.log('Profile update response:', response.data);
      setMessage('Profile updated successfully!');
      setVariant('success');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Update failed. Try again.');
      setVariant('danger');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Admin Settings</h4>
        </div>
        <div className="card-body">
          {message && <div className={`alert alert-${variant}`}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
              />
              <label className="form-check-label">Receive Notifications</label>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
