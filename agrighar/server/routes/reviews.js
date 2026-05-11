const express = require("express");
const Review  = require("../models/Review");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── GET /api/reviews/:productId ───────────────────────────────
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/reviews ─────────────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: "Product ID and rating are required" });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ productId, userId: req.user._id });
    if (existing) {
      // Update existing review
      existing.rating  = rating;
      existing.comment = comment;
      await existing.save();
      await updateProductRating(productId);
      return res.json(existing);
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      productId,
      userId:    req.user._id,
      userName:  req.user.name,
      farmerId:  product.farmerId,
      rating,
      comment,
    });

    // Update product average rating
    await updateProductRating(productId);

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/reviews/:id ───────────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { productId } = review;
    await review.deleteOne();
    await updateProductRating(productId);

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper — recalculate product avg rating
async function updateProductRating(productId) {
  const reviews = await Review.find({ productId });
  const count   = reviews.length;
  const avg     = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  await Product.findByIdAndUpdate(productId, {
    avgRating:   Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

module.exports = router;
