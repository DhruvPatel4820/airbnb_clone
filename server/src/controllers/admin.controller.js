const catchAsync = require("../utils/catchAsync");

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
} = require("../services/admin.service");

// =========================
// USERS
// =========================

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await getUserById(req.params.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUserStatus = catchAsync(async (req, res) => {
  const user = await updateUserStatus(req.params.userId, req.body.isActive);

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await deleteUser(req.params.userId);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// =========================
// LISTINGS
// =========================

exports.getAllListings = catchAsync(async (req, res) => {
  const listings = await getAllListings();

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

exports.updateListingStatus = catchAsync(async (req, res) => {
  const listing = await updateListingStatus(
    req.params.listingId,
    req.body.isActive,
  );

  res.status(200).json({
    success: true,
    message: "Listing status updated successfully",
    data: listing,
  });
});

exports.deleteListing = catchAsync(async (req, res) => {
  await deleteListing(req.params.listingId);

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});

// =========================
// BOOKINGS
// =========================

exports.getAllBookings = catchAsync(async (req, res) => {
  const bookings = await getAllBookings();

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// =========================
// REVIEWS
// =========================

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await getAllReviews();

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  await deleteReview(req.params.reviewId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
