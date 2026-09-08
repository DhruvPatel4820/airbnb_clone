const catchAsync = require("../utils/catchAsync");

const {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} = require("../services/listing.service");

const uploadToCloudinary = require("../utils/cloudinaryUpload");

const AppError = require("../utils/AppError");

// =========================
// CREATE
// =========================

exports.createListing = catchAsync(async (req, res) => {
  let imageUrls = [];

  // =========================
  // UPLOAD IMAGES
  // =========================

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer),
    );

    const uploadResults = await Promise.all(uploadPromises);

    imageUrls = uploadResults.map((result) => result.secure_url);
  }

  // =========================
  // LISTING DATA
  // =========================

  const listingData = {
    ...req.body,
    images: imageUrls,
  };

  const listing = await createListing(listingData, req.user._id);

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });
});

// =========================
// GET ALL
// =========================

exports.getAllListings = catchAsync(async (req, res) => {
  const { search, propertyType, minPrice, maxPrice, guests, sort } = req.query;

  // =========================
  // VALIDATE PRICE RANGE
  // =========================

  if (
    minPrice !== undefined &&
    minPrice !== "" &&
    (Number.isNaN(Number(minPrice)) || Number(minPrice) < 0)
  ) {
    throw new AppError("Minimum price must be a valid positive number", 400);
  }

  if (
    maxPrice !== undefined &&
    maxPrice !== "" &&
    (Number.isNaN(Number(maxPrice)) || Number(maxPrice) < 0)
  ) {
    throw new AppError("Maximum price must be a valid positive number", 400);
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice)
  ) {
    throw new AppError(
      "Minimum price cannot be greater than maximum price",
      400,
    );
  }

  // =========================
  // VALIDATE GUESTS
  // =========================

  if (
    guests !== undefined &&
    guests !== "" &&
    (!Number.isInteger(Number(guests)) || Number(guests) < 1)
  ) {
    throw new AppError("Guests must be a valid positive number", 400);
  }

  // =========================
  // GET LISTINGS
  // =========================

  const listings = await getAllListings({
    search,
    propertyType,
    minPrice,
    maxPrice,
    guests,
    sort,
  });

  res.status(200).json({
    success: true,
    count: listings.length,
    filters: {
      search: search || "",
      propertyType: propertyType || "all",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      guests: guests || "",
      sort: sort || "newest",
    },
    data: listings,
  });
});

// =========================
// GET ONE
// =========================

exports.getListingById = catchAsync(async (req, res) => {
  const listing = await getListingById(req.params.id);

  res.status(200).json({
    success: true,
    data: listing,
  });
});

// =========================
// GET MY LISTINGS
// =========================

exports.getMyListings = catchAsync(async (req, res) => {
  const listings = await getMyListings(req.user._id);

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

// =========================
// UPDATE
// =========================

exports.updateListing = catchAsync(async (req, res) => {
  let newImageUrls = [];

  // =========================
  // UPLOAD NEW IMAGES
  // =========================

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer),
    );

    const uploadResults = await Promise.all(uploadPromises);

    newImageUrls = uploadResults.map((result) => result.secure_url);
  }

  // =========================
  // EXISTING IMAGES
  // =========================

  let existingImages;

  if (req.body.existingImages !== undefined) {
    existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : [req.body.existingImages];
  }

  // =========================
  // UPDATE DATA
  // =========================

  const updateData = {
    ...req.body,
  };

  delete updateData.existingImages;

  // =========================
  // IMAGE UPDATE
  // =========================

  if (existingImages !== undefined) {
    updateData.images = [...existingImages, ...newImageUrls];
  } else if (newImageUrls.length > 0) {
    updateData.images = newImageUrls;
  }

  // =========================
  // MAX 5 IMAGES
  // =========================

  if (updateData.images && updateData.images.length > 5) {
    throw new AppError("A listing can have maximum 5 images.", 400);
  }

  // =========================
  // UPDATE
  // =========================

  const listing = await updateListing(req.params.id, updateData, req.user);

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: listing,
  });
});

// =========================
// DELETE
// =========================

exports.deleteListing = catchAsync(async (req, res) => {
  await deleteListing(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});
