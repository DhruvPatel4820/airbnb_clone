const catchAsync = require("../utils/catchAsync");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookings,
  updateBookingStatus,
} = require("../services/booking.service");

// =========================
// CREATE BOOKING
// =========================

exports.createBooking = catchAsync(async (req, res) => {
  const booking = await createBooking(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await getMyBookings(req.user._id);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

exports.getBookingById = catchAsync(async (req, res) => {
  const booking = await getBookingById(
    req.params.bookingId,
    req.user._id,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

exports.cancelBooking = catchAsync(async (req, res) => {
  const booking = await cancelBooking(
    req.params.bookingId,
    req.user._id,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

exports.getOwnerBookings = catchAsync(async (req, res) => {
  const bookings = await getOwnerBookings(req.user._id);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

exports.updateBookingStatus = catchAsync(async (req, res) => {
  const booking = await updateBookingStatus(
    req.params.bookingId,
    req.user._id,
    req.user.role,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking,
  });
});
