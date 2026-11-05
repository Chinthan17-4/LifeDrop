const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["request","match","confirmation","contact","emergency"], default: "request" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  relatedId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);

