// 1. Listing exist karti hai?
// 2. Guests capacity ke andar hain?
// 3. Dates available hain?
// 4. Total nights calculate
// 5. Total price calculate

const Booking = require("../models/booking.model");
const Listing = require("../models/listing.model");
const AppError = require("../utils/AppError");

// =========================
// CREATE BOOKING
// =========================

const createBooking = async (bookingData, userId) => {
  const { listingId, checkIn, checkOut, guests } = bookingData;

  // =========================
  // 1. FIND LISTING
  // =========================

  const listing = await Listing.findOne({
    _id: listingId,
    isActive: true,
  });

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // =========================
  // 2. CHECK GUEST CAPACITY
  // =========================

  if (guests > listing.guests) {
    throw new AppError(
      `This listing can accommodate maximum ${listing.guests} guests`,
      400,
    );
  }

  // =========================
  // 3. CHECK OWNER
  // =========================

  if (listing.owner.toString() === userId.toString()) {
    throw new AppError("You cannot book your own listing", 400);
  }

  // =========================
  // 4. CHECK DATE OVERLAP
  // =========================

  const overlappingBooking = await Booking.findOne({
    listing: listingId,

    status: {
      $in: ["pending", "confirmed"],
    },

    checkIn: {
      $lt: new Date(checkOut),
    },

    checkOut: {
      $gt: new Date(checkIn),
    },
  });

  if (overlappingBooking) {
    throw new AppError("Listing is not available for the selected dates", 409);
  }

  // =========================
  // 5. CALCULATE NIGHTS
  // =========================

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const totalNights = Math.ceil(
    (checkOutDate - checkInDate) / millisecondsPerDay,
  );

  // =========================
  // 6. CALCULATE TOTAL PRICE
  // =========================

  const pricePerNight = listing.price;

  const totalPrice = pricePerNight * totalNights;

  // =========================
  // 7. CREATE BOOKING
  // =========================

  const booking = await Booking.create({
    user: userId,
    listing: listingId,

    checkIn: checkInDate,
    checkOut: checkOutDate,

    guests,

    pricePerNight,
    totalNights,
    totalPrice,

    status: "confirmed",
  });

  // =========================
  // 8. RETURN BOOKING
  // =========================

  return Booking.findById(booking._id)
    .populate("user", "fullName username avatar")
    .populate("listing", "title price location images");
};

// =========================
// GET MY BOOKINGS
// =========================

const getMyBookings = async (userId) => {
  const bookings = await Booking.find({
    user: userId,
  })
    .populate("listing", "title price location images")
    .sort({ createdAt: -1 });

  return bookings;
};

// =========================
// GET BOOKING BY ID
// =========================

const getBookingById = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId)
    .populate("user", "fullName username avatar")
    .populate("listing", "title price location images owner");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Guest who created the booking
  const isGuest = booking.user._id.toString() === userId.toString();

  // Owner of the listing
  const isListingOwner =
    booking.listing &&
    booking.listing.owner &&
    booking.listing.owner.toString() === userId.toString();

  // Admin
  const isAdmin = userRole === "admin";

  if (!isGuest && !isListingOwner && !isAdmin) {
    throw new AppError("You are not allowed to view this booking", 403);
  }

  return booking;
};

// =========================
// CANCEL BOOKING
// =========================

const cancelBooking = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const isOwner = booking.user.toString() === userId.toString();

  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to cancel this booking", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  if (booking.status === "completed") {
    throw new AppError("Completed booking cannot be cancelled", 400);
  }

  booking.status = "cancelled";

  await booking.save();

  return booking;
};

// =========================
// GET OWNER BOOKINGS
// =========================

const getOwnerBookings = async (ownerId) => {
  const bookings = await Booking.find()
    .populate("user", "fullName username avatar")
    .populate({
      path: "listing",
      select: "title price location images owner",
      match: {
        owner: ownerId,
      },
    })
    .sort({ createdAt: -1 });

  // match ki wajah se owner ki nahi hone wali
  // listings null ho jayengi
  return bookings.filter((booking) => booking.listing !== null);
};

// =========================
// UPDATE BOOKING STATUS
// =========================

const updateBookingStatus = async (bookingId, userId, userRole, newStatus) => {
  const booking = await Booking.findById(bookingId).populate(
    "listing",
    "title owner",
  );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // =========================
  // AUTHORIZATION
  // =========================

  const isOwner = booking.listing.owner.toString() === userId.toString();

  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to update this booking", 403);
  }

  // =========================
  // STATUS TRANSITION
  // =========================

  if (booking.status === "cancelled") {
    throw new AppError("Cancelled booking cannot be updated", 400);
  }

  if (booking.status === "completed") {
    throw new AppError("Completed booking cannot be updated", 400);
  }

  // =========================
  // UPDATE
  // =========================

  booking.status = newStatus;

  await booking.save();

  return Booking.findById(booking._id)
    .populate("user", "fullName username avatar")
    .populate("listing", "title price location images");
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookings,
  updateBookingStatus,
};
