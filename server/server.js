const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lifedrop")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/donors", require("./routes/donors"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/notifications", require("./routes/notifications"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "LifeDrop API", version: "1.0.0" });
});

app.listen(PORT, () => console.log(`🚀 LifeDrop server running on port ${PORT}`));

