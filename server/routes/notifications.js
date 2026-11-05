const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET /api/notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.query.userId }).sort("-createdAt");
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/read-all
router.patch("/read-all", async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.query.userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

