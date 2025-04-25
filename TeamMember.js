const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  avatar:{ type: String },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);