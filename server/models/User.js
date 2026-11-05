const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["donor", "recipient"], required: true },
  phone: String,
  age: Number,
  bloodGroup: { type: String, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
  city: String,
  weight: Number,
  available: { type: Boolean, default: true },
  donationCount: { type: Number, default: 0 },
  lastDonation: Date,
  lat: Number,
  lng: Number,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

