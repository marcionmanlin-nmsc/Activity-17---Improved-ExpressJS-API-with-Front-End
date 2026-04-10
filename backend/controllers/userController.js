const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updates = {};
    if (name) updates.name = name;

    if (req.file) {
      updates.profile_picture = `/uploads/profiles/${req.file.filename}`;

      // Delete old picture if exists
      const user = await User.findById(req.user.id);
      if (user && user.profile_picture) {
        const oldPath = path.join(__dirname, '..', user.profile_picture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await User.updateProfile(req.user.id, updates);
    const updated = await User.findById(req.user.id);
    res.json({ message: 'Profile updated.', user: updated });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
