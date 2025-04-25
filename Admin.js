const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  darkMode: { type: Boolean, default: false },
  notifications: { type: Boolean, default: true },

  role: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Admin', adminSchema);
