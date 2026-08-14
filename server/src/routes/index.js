const express = require("express");

const router = express.Router();

const authRoutes = require("./auth.routes");
const listingRoutes = require("./listing.routes");
const reviewRoutes = require("./review.routes");
const bookingRoutes = require("./booking.routes");
const adminRoutes = require("./admin.routes");

// =========================
// API VERSION 1
// =========================

router.use("/auth", authRoutes);

router.use("/listings", listingRoutes);

router.use("/reviews", reviewRoutes);

router.use("/bookings", bookingRoutes);

router.use("/admin", adminRoutes);

module.exports = router;
