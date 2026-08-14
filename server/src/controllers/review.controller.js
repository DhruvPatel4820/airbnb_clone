const catchAsync = require("../utils/catchAsync");

const {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview,
} = require("../services/review.service");

// =========================
// CREATE REVIEW
// =========================

exports.createReview = catchAsync(async (req, res) => {
  const review = await createReview(
    req.params.listingId,
    req.user._id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

// =========================
// GET REVIEWS
// =========================

exports.getListingReviews = catchAsync(async (req, res) => {
  const reviews = await getListingReviews(req.params.listingId);

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// =========================
// UPDATE REVIEW
// =========================

exports.updateReview = catchAsync(async (req, res) => {
  const review = await updateReview(
    req.params.id,
    req.user._id,
    req.body,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

// =========================
// DELETE REVIEW
// =========================

exports.deleteReview = catchAsync(async (req, res) => {
  await deleteReview(req.params.id, req.user._id, req.user.role);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
