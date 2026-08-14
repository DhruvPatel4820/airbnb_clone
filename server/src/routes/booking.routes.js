const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate.middleware");

const {
  createBookingSchema,
  updateBookingStatusSchema,
} = require("../validators/booking.validator");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookings,
  updateBookingStatus,
} = require("../controllers/booking.controller");

const protect = require("../middleware/auth.middleware");

router.post("/", protect, validate(createBookingSchema), createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/owner", protect, getOwnerBookings);

router.get("/:bookingId", protect, getBookingById);
router.patch("/:bookingId/cancel", protect, cancelBooking);
router.patch(
  "/:bookingId/status",
  protect,
  validate(updateBookingStatusSchema),
  updateBookingStatus,
);
module.exports = router;
