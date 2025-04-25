const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
