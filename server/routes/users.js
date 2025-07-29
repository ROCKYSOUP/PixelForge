const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/leads", auth, async (req, res) => {
  try {
    const leads = await User.find({ role: "ProjectLead" }, "_id name email");
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/developers", auth, async (req, res) => {
  try {
    const devs = await User.find({ role: "Developer" }).select("name email");
    res.json(devs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching developers" });
  }
});
// Get all users - Admin only
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ msg: "Only Admins can view users" });

  try {
    const users = await User.find({}, "-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
});

// Update user role - Admin only
router.put("/:id/role", auth, async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ msg: "Only Admins can update roles" });

  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error updating role" });
  }
});

module.exports = router;

