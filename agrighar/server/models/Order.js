const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:      { type: String },
  price:     { type: Number, required: true },
  qty:       { type: Number, required: true, min: 1 },
  unit:      { type: String },
  farmerId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farmerName:{ type: String },
});

const orderSchema = new mongoose.Schema(
  {
    consumerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    consumerName: { type: String },

    items: [orderItemSchema],

    totalAmount:     { type: Number, required: true },
    deliveryFee:     { type: Number, default: 0 },
    grandTotal:      { type: Number, required: true },

    deliveryAddress: { type: String, required: true },
    phone:           { type: String },
    notes:           { type: String, default: "" },

    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    status: {
      type: String,
      enum: ["pending", "confirmed", "dispatched", "delivered", "cancelled"],
      default: "pending",
    },

    statusHistory: [
      {
        status:    String,
        updatedAt: { type: Date, default: Date.now },
        note:      String,
      },
    ],
  },
  { timestamps: true }
);

orderSchema.index({ consumerId: 1 });
orderSchema.index({ "items.farmerId": 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
