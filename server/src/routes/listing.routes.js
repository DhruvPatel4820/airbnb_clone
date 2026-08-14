const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createListingSchema,
  updateListingSchema,
} = require("../validators/listing.validator");

const {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} = require("../controllers/listing.controller");

// =========================
// PUBLIC ROUTES
// =========================

router.get("/", getAllListings);

// =========================
// PROTECTED ROUTES
// =========================

router.post(
  "/",
  protect,
  upload.array("images", 5),
  validate(createListingSchema),
  createListing,
);

router.get("/my-listings", protect, getMyListings);

// =========================
// LISTING BY ID
// =========================

router.get("/:id", getListingById);

router.patch(
  "/:id",
  protect,
  upload.array("images", 5),
  validate(updateListingSchema),
  updateListing,
);

router.delete("/:id", protect, deleteListing);

module.exports = router;
