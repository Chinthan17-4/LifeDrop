const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/donors — query: bloodGroup, city, available
router.get("/", async (req, res) => {
  try {
    const filter = { role: "donor" };
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.city) filter.city = req.query.city;
    if (req.query.available === "true") filter.available = true;
    const donors = await User.find(filter).select("-firebaseUid");
    res.json({ success: true, donors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/donors/:id
router.get("/:id", async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select("-firebaseUid");
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });
    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/donors/:id/toggle — toggle availability
router.patch("/:id/toggle", async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });
    donor.available = !donor.available;
    await donor.save();
    res.json({ success: true, available: donor.available });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

