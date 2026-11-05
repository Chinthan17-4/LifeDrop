const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const { BLOOD_COMPATIBILITY } = require("../config/bloodData");

// POST /api/requests
router.post("/", async (req, res) => {
  try {
    const request = await BloodRequest.create(req.body);
    // Smart matching: find compatible available donors in same city
    const compatible = BLOOD_COMPATIBILITY[request.bloodGroup] || [request.bloodGroup];
    const matched = await User.find({
      role: "donor",
      available: true,
      bloodGroup: { $in: compatible },
      city: request.city,
    }).limit(10);
    request.matchedDonors = matched.map(d => d._id);
    await request.save();
    res.status(201).json({ success: true, request, matchedCount: matched.length });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/requests/mine
router.get("/mine", async (req, res) => {
  try {
    const userId = req.query.userId;
    const requests = await BloodRequest.find({ requestedBy: userId }).sort("-createdAt");
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/requests
router.get("/", async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort("-createdAt").populate("requestedBy", "name city");
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/requests/:id
router.patch("/:id", async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

