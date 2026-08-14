const Review = require("../models/review.model");
const Listing = require("../models/listing.model");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

// =========================
// UPDATE LISTING RATING
// =========================

const updateListingRating = async (listingId) => {
  const objectListingId = new mongoose.Types.ObjectId(listingId);
  const result = await Review.aggregate([
    {
      $match: {
        listing: objectListingId,
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

  console.log("Listing ID:", listingId);
  console.log("Rating aggregation result:", result);

  if (result.length === 0) {
    await Listing.findByIdAndUpdate(
      listingId,
      {
        averageRating: 0,
        totalReviews: 0,
      },
      {
        new: true,
      },
    );

    return;
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    {
      averageRating: Number(result[0].averageRating.toFixed(2)),
      totalReviews: result[0].totalReviews,
    },
    {
      new: true,
    },
  );

  console.log("Updated listing:", updatedListing);
};

// =========================
// CREATE REVIEW
// =========================

const createReview = async (listingId, userId, reviewData) => {
  const listing = await Listing.findOne({
    _id: listingId,
    isActive: true,
  });

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // Owner cannot review own listing
  if (listing.owner.toString() === userId.toString()) {
    throw new AppError("You cannot review your own listing", 400);
  }

  const existingReview = await Review.findOne({
    user: userId,
    listing: listingId,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this listing", 409);
  }

  const review = await Review.create({
    ...reviewData,
    user: userId,
    listing: listingId,
  });

  await updateListingRating(listingId);

  return Review.findById(review._id).populate(
    "user",
    "fullName username avatar",
  );
};

// =========================
// GET LISTING REVIEWS
// =========================

const getListingReviews = async (listingId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  const reviews = await Review.find({
    listing: listingId,
  })
    .populate("user", "fullName username avatar")
    .sort({ createdAt: -1 });

  return reviews;
};

// =========================
// UPDATE REVIEW
// =========================

const updateReview = async (reviewId, userId, updateData, userRole) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const isOwner = review.user.toString() === userId.toString();

  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to update this review", 403);
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "fullName username avatar");

  await updateListingRating(review.listing);

  return updatedReview;
};

// =========================
// DELETE REVIEW
// =========================

const deleteReview = async (reviewId, userId, userRole) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const isOwner = review.user.toString() === userId.toString();

  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to delete this review", 403);
  }

  const listingId = review.listing;

  await Review.findByIdAndDelete(reviewId);

  await updateListingRating(listingId);

  return;
};

module.exports = {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview,
};
