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
  const listings = await getAllListings();

  res.status(200).json({
    success: true,
    count: listings.length,
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
