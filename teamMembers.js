const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
});

// Add a new team member
router.post('/', async (req, res) => {
  try {
    const { name, role, email, avatar } = req.body;
    const newMember = new
     TeamMember({ name, role, email, avatar });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error('Error saving member:', err);
    res.status(400).json({ message: 'Error saving team member' });
  }
});

// Update a team member
router.put('/:id', async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating member' });
  }
});

// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully'});
  } catch (err) {
    res.status(400).json({ message: 'Error deleting member' });
  }
});

module.exports = router;