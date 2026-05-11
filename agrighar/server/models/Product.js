const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category:    { type: String, enum: ["vegetables","fruits","grains","dairy","spices","other"], required: true },
    price:       { type: Number, required: true, min: 0 },
    unit:        { type: String, enum: ["kg","piece","dozen","liter","bundle","quintal"], default: "kg" },
    quantity:    { type: Number, required: true, min: 0, default: 0 },
    image:       { type: String, default: "" },
    isOrganic:   { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },

    // Farmer reference
    farmerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmerName: { type: String },

    // Location (copied from farmer for quick queries)
    location: {
      type:        { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    // Ratings (computed)
    avgRating:   { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ location: "2dsphere" });
productSchema.index({ category: 1 });
productSchema.index({ farmerId: 1 });
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
