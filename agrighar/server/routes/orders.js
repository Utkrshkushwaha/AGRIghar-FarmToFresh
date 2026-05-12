const express = require("express");
const Order   = require("../models/Order");
const Product = require("../models/Product");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// ── POST /api/orders ──────────────────────────────────────────
// Consumer — place a new order
router.post("/", protect, authorize("consumer", "vendor"), async (req, res) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (!product.isAvailable) return res.status(400).json({ message: `${product.name} is out of stock` });

      orderItems.push({
        productId:  product._id,
        name:       product.name,
        price:      product.price,
        qty:        item.qty,
        unit:       product.unit,
        farmerId:   product.farmerId,
        farmerName: product.farmerName,
      });

      totalAmount += product.price * item.qty;
      await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -item.qty } });
    }

    const deliveryFee = totalAmount > 200 ? 0 : 30;
    const grandTotal  = totalAmount + deliveryFee;

    const order = await Order.create({
      consumerId:   req.user._id,
      consumerName: req.user.name,
      items:        orderItems,
      totalAmount,
      deliveryFee,
      grandTotal,
      deliveryAddress,
      phone:         phone || req.user.phone,
      paymentMethod: paymentMethod || "cod",
      notes,
      statusHistory: [{ status: "pending", note: "Order placed" }],
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ⚠️ NAMED ROUTES MUST BE BEFORE /:id

// ── GET /api/orders/my-orders ─────────────────────────────────
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ consumerId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/farmer-orders ────────────────────────────
router.get("/farmer-orders", protect, authorize("farmer"), async (req, res) => {
  try {
    const orders = await Order.find({ "items.farmerId": req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/:id ───────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isFarmerInOrder = order.items.some(
      (i) => i.farmerId?.toString() === req.user._id.toString()
    );
    if (
      order.consumerId.toString() !== req.user._id.toString() &&
      !isFarmerInOrder &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/orders/:id/status ────────────────────────────────
router.put("/:id/status", protect, authorize("farmer", "admin"), async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ["confirmed", "dispatched", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Marked as ${status}` });

    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/orders/:id/cancel ────────────────────────────────
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.consumerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", note: "Cancelled by consumer" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.qty } });
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only consumer or farmer involved can view
    const isFarmerInOrder = order.items.some(
      (i) => i.farmerId?.toString() === req.user._id.toString()
    );
    if (
      order.consumerId.toString() !== req.user._id.toString() &&
      !isFarmerInOrder &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/orders/:id/status ────────────────────────────────
// Farmer — update order status
router.put("/:id/status", protect, authorize("farmer", "admin"), async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ["confirmed", "dispatched", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Marked as ${status}` });

    // Mark payment as paid on delivery
    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/orders/:id/cancel ────────────────────────────────
// Consumer — cancel pending order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.consumerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", note: "Cancelled by consumer" });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.qty } });
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
