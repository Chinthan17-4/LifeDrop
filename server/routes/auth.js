const express = require("express");
const router = express.Router();
const User = require("../models/User");
const admin = require("../config/firebase");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { firebaseToken, ...userData } = req.body;
    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const user = await User.create({ ...userData, firebaseUid: decoded.uid, email: decoded.email });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

module.exports = router;

