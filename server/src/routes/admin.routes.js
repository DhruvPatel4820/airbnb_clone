const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const validate = require("../middleware/validate.middleware");

const {
  updateUserStatusSchema,
  updateListingStatusSchema,
} = require("../validators/admin.validator");

const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,

  getAllListings,
  updateListingStatus,
  deleteListing,

  getAllBookings,

  getAllReviews,
  deleteReview,
} = require("../controllers/admin.controller");

// =========================
// ADMIN PROTECTION
// =========================

// Every route below requires:
// 1. Authentication
// 2. Admin role

router.use(protect, authorize("admin"));

// =========================
// USERS
// =========================

router.get("/users", getAllUsers);

router.get("/users/:userId", getUserById);

router.patch(
  "/users/:userId/status",
  validate(updateUserStatusSchema),
  updateUserStatus,
);

router.delete("/users/:userId", deleteUser);

// =========================
// LISTINGS
// =========================

router.get("/listings", getAllListings);

router.patch(
  "/listings/:listingId/status",
  validate(updateListingStatusSchema),
  updateListingStatus,
);

router.delete("/listings/:listingId", deleteListing);

// =========================
// BOOKINGS
// =========================

router.get("/bookings", getAllBookings);

// =========================
// REVIEWS
// =========================

router.get("/reviews", getAllReviews);

router.delete("/reviews/:reviewId", deleteReview);

module.exports = router;
