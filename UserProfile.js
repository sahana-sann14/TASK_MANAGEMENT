import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({ name: storedUser.name, email: storedUser.email });
    }
  }, []);

  const handleImageChange = (e) => setNewImage(e.target.files[0]);

  const handleUpload = async () => {
    if (!newImage) return;
    const formDataImage = new FormData();
    formDataImage.append('image', newImage);

    try {
      const res = await axios.post('http://localhost:5000/api/users/upload-profile', formDataImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const updatedUser = { ...user, profileImage: res.data.imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setNewImage(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleEditSave = async () => {
    try {
       await axios.put(
        `http://localhost:5000/api/users/update-profile`,
        { name: formData.name, email: formData.email },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedUser = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/change-password`,
        passwords,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Password changed successfully!');
      setPasswords({ current: '', new: '' });
    } catch (error) {
      alert('Password change failed!');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-4">
              <img
                src={user.profileImage || '/default-avatar.png'}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <div className="mt-3">
                <input type="file" onChange={handleImageChange} className="form-control" />
                <button className="btn btn-primary mt-2" onClick={handleUpload}>
                  Upload New Profile Picture
                </button>
              </div>
            </div>

            <h5 className="mb-3">Profile Information</h5>
            {editing ? (
              <>
                <div className="mb-2">
                  <input
                    className="form-control"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <button className="btn btn-success me-2" onClick={handleEditSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button className="btn btn-outline-primary" onClick={() => setEditing(true)}>Edit Info</button>
              </>
            )}

            <hr className="my-4" />

            <h5>Change Password</h5>
            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              />
            </div>
            <button className="btn btn-danger" onClick={handlePasswordChange}>
              Change Password
            </button>

            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/login'; // Redirect to login
                }}
              >
                Logout
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  const body = document.body;
                  body.classList.toggle('bg-dark');
                  body.classList.toggle('text-light');
                }}
              >
                Toggle Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
