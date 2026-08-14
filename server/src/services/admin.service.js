const User = require("../models/user.model");
const Listing = require("../models/listing.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");
const AppError = require("../utils/AppError");

// =========================
// GET ALL USERS
// =========================

const getAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

// =========================
// GET SINGLE USER
// =========================

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// =========================
// UPDATE USER STATUS
// =========================

const updateUserStatus = async (userId, isActive) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin status cannot be changed", 400);
  }

  user.isActive = isActive;

  await user.save();

  return User.findById(userId).select("-password");
};
// =========================
// DELETE USER
// =========================

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin user cannot be deleted", 400);
  }

  await User.findByIdAndDelete(userId);

  return null;
};

// =========================
// GET ALL LISTINGS
// =========================

const getAllListings = async () => {
  return Listing.find()
    .populate("owner", "fullName username email")
    .sort({ createdAt: -1 });
};

// =========================
// UPDATE LISTING STATUS
// =========================

const updateListingStatus = async (listingId, isActive) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  listing.isActive = isActive;

  await listing.save();

  return Listing.findById(listingId).populate(
    "owner",
    "fullName username email",
  );
};

// =========================
// DELETE LISTING
// =========================

const deleteListing = async (listingId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  await Listing.findByIdAndDelete(listingId);

  return null;
};

// =========================
// GET ALL BOOKINGS
// =========================

const getAllBookings = async () => {
  return Booking.find()
    .populate("user", "fullName username email")
    .populate("listing", "title price location")
    .sort({ createdAt: -1 });
};

// =========================
// GET ALL REVIEWS
// =========================

const getAllReviews = async () => {
  return Review.find()
    .populate("user", "fullName username avatar")
    .populate("listing", "title")
    .sort({ createdAt: -1 });
};

// =========================
// DELETE REVIEW
// =========================

const deleteReview = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const listingId = review.listing;

  await Review.findByIdAndDelete(reviewId);

  // Recalculate listing rating
  const result = await Review.aggregate([
    {
      $match: {
        listing: listingId,
      },
    },
    {
      $group: {
        _id: "$listing",
        averageRating: {
          $avg: "$rating",
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Listing.findByIdAndUpdate(listingId, {
      averageRating: 0,
      totalReviews: 0,
    });
  } else {
    await Listing.findByIdAndUpdate(listingId, {
      averageRating: Number(result[0].averageRating.toFixed(2)),
      totalReviews: result[0].totalReviews,
    });
  }

  return null;
};

module.exports = {
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
};
