// controllers/chatController.js
const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  try {
    const room = req.params.room;
    const messages = await Chat.find({ room }).populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { sender, message, room } = req.body;
    const newMessage = new Chat({ sender, message, room });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
