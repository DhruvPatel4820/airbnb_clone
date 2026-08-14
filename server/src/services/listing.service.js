const Listing = require("../models/listing.model");
const AppError = require("../utils/AppError");

// =========================
// CREATE LISTING
// =========================

const createListing = async (listingData, userId) => {
  const listing = await Listing.create({
    ...listingData,
    owner: userId,
  });

  return listing;
};

// =========================
// GET ALL LISTINGS
// =========================

const getAllListings = async () => {
  const listings = await Listing.find({
    isActive: true,
  })
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 });

  return listings;
};

// =========================
// GET SINGLE LISTING
// =========================

const getListingById = async (listingId) => {
  const listing = await Listing.findOne({
    _id: listingId,
    isActive: true,
  }).populate("owner", "fullName username avatar");

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  return listing;
};

// =========================
// UPDATE LISTING
// =========================

const updateListing = async (listingId, updateData, user) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // =========================
  // CHECK OWNER
  // =========================

  const isOwner = listing.owner.toString() === user._id.toString();

  // =========================
  // CHECK ADMIN
  // =========================

  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to update this listing", 403);
  }

  // =========================
  // NEVER ALLOW OWNER CHANGE
  // =========================

  delete updateData.owner;

  // =========================
  // IMAGE LIMIT
  // =========================

  if (updateData.images && updateData.images.length > 5) {
    throw new AppError("A listing can have maximum 5 images.", 400);
  }

  // =========================
  // UPDATE
  // =========================

  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("owner", "fullName username avatar");

  return updatedListing;
};

// =========================
// DELETE LISTING
// =========================

const deleteListing = async (listingId, user) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  const isOwner = listing.owner.toString() === user._id.toString();

  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to delete this listing", 403);
  }

  await Listing.findByIdAndDelete(listingId);
};

// =========================
// GET MY LISTINGS
// =========================

const getMyListings = async (userId) => {
  const listings = await Listing.find({
    owner: userId,
  })
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 });

  return listings;
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
};
