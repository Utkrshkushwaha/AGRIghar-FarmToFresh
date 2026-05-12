const express = require("express");
const Product = require("../models/Product");
const User    = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// ── GET /api/products ─────────────────────────────────────────
// Public — browse all products with filters
router.get("/", async (req, res) => {
  try {
    const {
      category, search, minPrice, maxPrice,
      isOrganic, isAvailable, sortBy,
      limit = 20, page = 1, farmerId
    } = req.query;

    const query = {};
    if (category && category !== "all") query.category = category;
    if (isOrganic === "true")           query.isOrganic = true;
    if (isAvailable === "true")         query.isAvailable = true;
    if (farmerId)                       query.farmerId = farmerId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { farmerName:  { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      rating:     { avgRating: -1 },
    };
    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("farmerId", "name address phone avgRating");

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/products/my-listings ────────────────────────────
// ⚠️ MUST be BEFORE /:id route to avoid conflict
// Farmer only — get own products
router.get("/my-listings", protect, authorize("farmer"), async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    const products = await Product.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("farmerId", "name address phone avgRating bio");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/products ────────────────────────────────────────
// Farmer only — create product
router.post("/", protect, authorize("farmer"), async (req, res) => {
  try {
    const { name, description, category, price, unit, quantity, image, isOrganic, isAvailable } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: "Name, category, price and quantity are required" });
    }
    if (price < 0)    return res.status(400).json({ message: "Price cannot be negative" });
    if (quantity < 0) return res.status(400).json({ message: "Quantity cannot be negative" });

    const product = await Product.create({
      name:        name.trim(),
      description: description?.trim() || "",
      category,
      price:       Number(price),
      unit:        unit || "kg",
      quantity:    Number(quantity),
      image:       image || "",
      isOrganic:   isOrganic || false,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      farmerId:    req.user._id,
      farmerName:  req.user.name,
      location:    req.user.location,
    });

    // Update farmer product count
    await User.findByIdAndUpdate(req.user._id, { $inc: { productCount: 1 } });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/products/:id ─────────────────────────────────────
// Farmer only — update own product
router.put("/:id", protect, authorize("farmer"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this product" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/products/:id ──────────────────────────────────
// Farmer only — delete own product
router.delete("/:id", protect, authorize("farmer"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $inc: { productCount: -1 } });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
