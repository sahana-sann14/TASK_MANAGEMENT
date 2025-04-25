// src/components/AddTeamMember.js
import React, { useState } from 'react';
import axios from 'axios';

const AddTeamMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', formData);
      alert('Team member added successfully!');
      setFormData({ name: '', email: '', role: '', avatar: '' });
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Team Member</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Avatar URL</label>
          <input
            type="text"
            className="form-control"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Member
        </button>
      </form>
    </div>
  );
};

export default AddTeamMember;