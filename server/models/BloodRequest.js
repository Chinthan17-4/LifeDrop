const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientName: { type: String, required: true },
  bloodGroup: { type: String, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"], required: true },
  units: { type: Number, default: 1 },
  hospital: { type: String, required: true },
  city: { type: String, required: true },
  neededBy: { type: Date, required: true },
  isEmergency: { type: Boolean, default: false },
  note: String,
  status: { type: String, enum: ["pending","matched","fulfilled","cancelled","emergency"], default: "pending" },
  matchedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

