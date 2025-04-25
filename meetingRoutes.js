const express = require('express');
const router = express.Router();
const Meeting = require('../models/meetingModel');

// POST - Start a meeting
router.post('/start', async (req, res) => {
  try {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const meeting = new Meeting({ roomName });
    await meeting.save();

    // If socket.io is not set up, this can also throw an error
    const io = req.app.get('io');
    if (io) {
      io.emit('newMeeting', meeting);
    } else {
      console.warn('Socket.io instance not found on app');
    }

    res.status(201).json(meeting);
  } catch (error) {
    console.error("Error in /start meeting route:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// GET - Current meeting
router.get('/current', async (req, res) => {
  const meeting = await Meeting.findOne().sort({ createdAt: -1 });
  res.json(meeting);
});

module.exports = router;
