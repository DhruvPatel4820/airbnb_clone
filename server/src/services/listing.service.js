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

// =========================
// GET ALL LISTINGS
// =========================

const getAllListings = async ({
  search,
  propertyType,
  minPrice,
  maxPrice,
  guests,
  sort,
} = {}) => {
  const filter = {
    isActive: true,
  };

  // =========================
  // SEARCH
  // =========================

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      { title: searchRegex },
      { "location.city": searchRegex },
      { "location.state": searchRegex },
    ];
  }

  // =========================
  // PROPERTY TYPE
  // =========================

  if (propertyType && propertyType !== "all") {
    filter.propertyType = propertyType;
  }

  // =========================
  // PRICE FILTER
  // =========================

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // =========================
  // GUEST FILTER
  // =========================

  if (guests) {
    filter.guests = {
      $gte: Number(guests),
    };
  }

  // =========================
  // SORT
  // =========================

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "price_asc") {
    sortOption = {
      price: 1,
    };
  }

  if (sort === "price_desc") {
    sortOption = {
      price: -1,
    };
  }

  if (sort === "rating") {
    sortOption = {
      averageRating: -1,
      totalReviews: -1,
    };
  }

  if (sort === "newest") {
    sortOption = {
      createdAt: -1,
    };
  }

  const listings = await Listing.find(filter)
    .populate("owner", "fullName username avatar")
    .sort(sortOption);

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
