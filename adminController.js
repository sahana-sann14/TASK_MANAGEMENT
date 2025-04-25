// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (admin)
const getAdminProfile = (req, res) => {
    const admin = req.user; // assuming admin info is set in req.user
    res.json({
      name: admin.name,
      email: admin.email,
      darkMode: admin.darkMode,
      notifications: admin.notifications,
    });
  };
  
  // @desc    Update admin profile
  // @route   PUT /api/admin/profile
  // @access  Private (admin)
  const updateAdminProfile = async (req, res) => {
    try {
      const admin = await Admin.findById(req.user._id); // assuming `Admin` model
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      if (req.body.password) admin.password = req.body.password;
      admin.darkMode = req.body.darkMode ?? admin.darkMode;
      admin.notifications = req.body.notifications ?? admin.notifications;
  
      const updatedAdmin = await admin.save();
      res.json({
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        darkMode: updatedAdmin.darkMode,
        notifications: updatedAdmin.notifications,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { getAdminProfile, updateAdminProfile };
  