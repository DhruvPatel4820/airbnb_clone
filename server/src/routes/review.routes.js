const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
  createReviewSchema,
  updateReviewSchema,
} = require("../validators/review.validator");

const {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

// =========================
// GET LISTING REVIEWS
// =======================S==

router.get("/listing/:listingId", getListingReviews);

// =========================
// CREATE REVIEW
// =========================

router.post(
  "/listing/:listingId",
  protect,
  validate(createReviewSchema),
  createReview,
);

// =========================
// UPDATE REVIEW
// =========================

router.patch("/:id", protect, validate(updateReviewSchema), updateReview);

// =========================
// DELETE REVIEW
// =========================

router.delete("/:id", protect, deleteReview);

module.exports = router;
