const express = require("express");
const User    = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

// ── GET /api/farmers ──────────────────────────────────────────
// Get all farmers
router.get("/", async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer", isActive: true })
      .select("-password")
      .sort({ avgRating: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/farmers/nearby ───────────────────────────────────
// Get farmers near a location
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query; // maxDistance in meters (50km default)

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const farmers = await User.find({
      role: "farmer",
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: Number(maxDistance),
        },
      },
    }).select("-password").limit(20);

    res.json(farmers);
  } catch (err) {
    // Fallback if geospatial index not set up
    const farmers = await User.find({ role: "farmer", isActive: true })
      .select("-password")
      .limit(20);
    res.json(farmers);
  }
});

// ── GET /api/farmers/:id ──────────────────────────────────────
// Get single farmer profile
router.get("/:id", async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id).select("-password");
    if (!farmer || farmer.role !== "farmer") {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Get their products
    const products = await Product.find({ farmerId: req.params.id, isAvailable: true });

    res.json({ ...farmer.toJSON(), products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
