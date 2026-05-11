  // require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
  // const express  = require("express");
  // const mongoose = require("mongoose");
  // const cors     = require("cors");
  // const dotenv   = require("dotenv");

  // dotenv.config();

  // const app = express();

  // // ── Middleware ──────────────────────────────────────────────
  // app.use(cors({ origin: "*", credentials: true }));
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  // // ── Routes ──────────────────────────────────────────────────
  // app.use("/api/auth",     require("./routes/auth"));
  // app.use("/api/products", require("./routes/products"));
  // app.use("/api/orders",   require("./routes/orders"));
  // app.use("/api/reviews",  require("./routes/reviews"));
  // app.use("/api/farmers",  require("./routes/farmers"));

  // // ── Health check ────────────────────────────────────────────
  // app.get("/", (req, res) => {
  //   res.json({
  //     message: "🌿 AGRIghar API is running!",
  //     team: "Green Coders",
  //     hackathon: "BGI Hackathon 2026",
  //   });
  // });

  // // ── 404 handler ─────────────────────────────────────────────
  // app.use((req, res) => {
  //   res.status(404).json({ message: "Route not found" });
  // });

  // // ── Error handler ───────────────────────────────────────────
  // app.use((err, req, res, next) => {
  //   console.error(err.stack);
  //   res.status(500).json({ message: "Server error", error: err.message });
  // });

  // console.log("MONGO_URI =", process.env.MONGO_URI);
  // // ── Connect DB & Start ──────────────────────────────────────
  // const PORT = process.env.PORT || 5000;

  // mongoose
  //   .connect(process.env.MONGO_URI)
  //   .then(() => {
  //     console.log("✅ MongoDB connected");
  //     app.listen(PORT, () => {
  //       console.log(`🚀 Server running on http://localhost:${PORT}`);
  //     });
  //   })
  //   .catch((err) => {
  //     console.error("❌ MongoDB connection failed:", err.message);
  //     process.exit(1);
  //   });

  // 🌐 Fix DNS for MongoDB SRV (important for some networks)
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ─────────────────────────────────────────────
   ✅ CORS FIX (Production + Vercel + Localhost)
───────────────────────────────────────────── */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://agr-ighar-farm-to-fresh.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server or mobile apps (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked: Not allowed origin"));
  },
  credentials: true
}));

/* ─────────────────────────────────────────────
   Middlewares
───────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────────────────────────────
   Routes
───────────────────────────────────────────── */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/farmers", require("./routes/farmers"));

/* ─────────────────────────────────────────────
   Health Check
───────────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({
    message: "🌿 AGRIghar API is running!",
    status: "healthy",
    team: "Green Coders"
  });
});

/* ─────────────────────────────────────────────
   404 Handler
───────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

/* ─────────────────────────────────────────────
   Error Handler
───────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    message: "Server error",
    error: err.message
  });
});

/* ─────────────────────────────────────────────
   MongoDB Connection + Server Start
───────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  });