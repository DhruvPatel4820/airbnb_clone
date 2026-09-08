import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./ListingDetails.css";

function ListingDetails() {
  const { listingId } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // =========================================
  // FETCH LISTING
  // =========================================

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/listings/${listingId}`);

        setListing(response.data.data);
        setSelectedImage(0);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    } else {
      setError("Listing ID is missing");
      setLoading(false);
    }
  }, [listingId]);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setBookingError("");
    setBookingSuccess("");
  };

  // =========================================
  // TODAY DATE
  // =========================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================
  // CALCULATE NIGHTS
  // =========================================

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const checkInDate = new Date(`${formData.checkIn}T00:00:00`);
    const checkOutDate = new Date(`${formData.checkOut}T00:00:00`);

    const difference = checkOutDate.getTime() - checkInDate.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const totalNights = calculateNights();

  const pricePerNight = Number(listing?.price || 0);

  const totalPrice = totalNights * pricePerNight;

  // =========================================
  // BOOKING
  // =========================================

  const handleBooking = async (event) => {
    event.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    // Check-in
    if (!formData.checkIn) {
      setBookingError("Please select a check-in date.");
      return;
    }

    // Check-out
    if (!formData.checkOut) {
      setBookingError("Please select a check-out date.");
      return;
    }

    const today = getTodayDate();

    // Past date
    if (formData.checkIn < today) {
      setBookingError("Check-in date cannot be in the past.");
      return;
    }

    // Check-out validation
    if (formData.checkOut <= formData.checkIn) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    // Guests
    const guests = Number(formData.guests);

    if (!Number.isInteger(guests) || guests < 1) {
      setBookingError("Guests must be at least 1.");
      return;
    }

    // Maximum guests
    if (guests > Number(listing.guests)) {
      setBookingError(
        `This property can accommodate a maximum of ${listing.guests} guests.`,
      );
      return;
    }

    // Nights
    if (totalNights <= 0) {
      setBookingError("Please select valid check-in and check-out dates.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await api.post("/bookings", {
        listingId: listing._id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests,
      });

      setBookingSuccess(
        response.data.message || "Booking created successfully!",
      );

      setFormData({
        checkIn: "",
        checkOut: "",
        guests: 1,
      });
    } catch (error) {
      setBookingError(
        error.response?.data?.message || "Failed to create booking",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="listing-details-page">
        <div className="listing-details-container">
          <div className="listing-state">
            <div className="listing-spinner"></div>
            <p>Loading listing...</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !listing) {
    return (
      <main className="listing-details-page">
        <div className="listing-details-container">
          <div className="listing-state listing-error-state">
            <h2>Listing not found</h2>

            <p>{error || "This listing does not exist."}</p>

            <Link to="/" className="btn btn-primary">
              Back to Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================
  // IMAGES
  // =========================================

  const images = Array.isArray(listing.images) ? listing.images : [];

  const currentImage =
    images.length > 0
      ? images[Math.min(selectedImage, images.length - 1)]
      : null;

  return (
    <main className="listing-details-page">
      <div className="listing-details-container">
        {/* =====================================
            BACK
        ===================================== */}

        <Link to="/" className="listing-back-link">
          ← Back to listings
        </Link>

        {/* =====================================
            GALLERY
        ===================================== */}

        <section className="listing-gallery">
          {/* ONLY ONE MAIN IMAGE */}
          <div className="listing-main-image">
            {currentImage ? (
              <img src={currentImage} alt={listing.title} />
            ) : (
              <div className="listing-image-placeholder">
                <span>🏠</span>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="listing-thumbnail-wrapper">
              <div className="listing-thumbnail-list">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={`listing-thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${listing.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =====================================
            MAIN LAYOUT
        ===================================== */}

        <section className="listing-layout">
          {/* ===================================
              LEFT CONTENT
          =================================== */}

          <div className="listing-main-content">
            {/* HEADING */}

            <div className="listing-heading">
              <div className="listing-heading-info">
                <p className="listing-type">{listing.propertyType}</p>

                <h1>{listing.title}</h1>

                <p className="listing-location">
                  📍 {listing.location?.city}, {listing.location?.state}
                </p>
              </div>

              <div className="listing-price">
                <strong>₹{pricePerNight.toLocaleString()}</strong>

                <span>/ night</span>
              </div>
            </div>

            {/* DESCRIPTION */}

            <section className="listing-section">
              <h2>About this place</h2>

              <p className="listing-description">{listing.description}</p>
            </section>

            {/* PROPERTY DETAILS */}

            <section className="listing-section">
              <h2>Property details</h2>

              <div className="property-details-grid">
                <div className="property-detail">
                  <span>🏠</span>

                  <div>
                    <strong>Property Type</strong>

                    <p>{listing.propertyType}</p>
                  </div>
                </div>

                <div className="property-detail">
                  <span>👥</span>

                  <div>
                    <strong>Guests</strong>

                    <p>Up to {listing.guests} guests</p>
                  </div>
                </div>

                <div className="property-detail">
                  <span>📍</span>

                  <div>
                    <strong>Location</strong>

                    <p>
                      {listing.location?.city}, {listing.location?.state}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* AMENITIES */}

            {listing.amenities?.length > 0 && (
              <section className="listing-section">
                <h2>Amenities</h2>

                <div className="amenities-list">
                  {listing.amenities.map((amenity, index) => (
                    <span className="amenity" key={`${amenity}-${index}`}>
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* REVIEWS */}

            <section className="listing-section">
              <h2>Reviews</h2>

              {listing.averageRating ? (
                <div className="rating-summary">
                  <strong>⭐ {listing.averageRating}</strong>

                  <span>{listing.totalReviews || 0} reviews</span>
                </div>
              ) : (
                <p className="no-reviews">No reviews yet.</p>
              )}
            </section>
          </div>

          {/* ===================================
              BOOKING CARD
          =================================== */}

          <aside className="listing-booking-card">
            <div className="booking-card-header">
              <h2>Book your stay</h2>

              <p>₹{pricePerNight.toLocaleString()} / night</p>
            </div>

            <form className="booking-form" onSubmit={handleBooking}>
              {/* CHECK-IN */}

              <div className="booking-form-group">
                <label htmlFor="checkIn">Check-in</label>

                <input
                  id="checkIn"
                  type="date"
                  name="checkIn"
                  min={getTodayDate()}
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CHECK-OUT */}

              <div className="booking-form-group">
                <label htmlFor="checkOut">Check-out</label>

                <input
                  id="checkOut"
                  type="date"
                  name="checkOut"
                  min={formData.checkIn || getTodayDate()}
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* GUESTS */}

              <div className="booking-form-group">
                <label htmlFor="guests">Guests</label>

                <input
                  id="guests"
                  type="number"
                  name="guests"
                  min="1"
                  max={listing.guests}
                  value={formData.guests}
                  onChange={handleChange}
                  required
                />

                <small>Maximum {listing.guests} guests</small>
              </div>

              {/* ERROR */}

              {bookingError && (
                <div className="booking-error">{bookingError}</div>
              )}

              {/* SUCCESS */}

              {bookingSuccess && (
                <div className="booking-success">{bookingSuccess}</div>
              )}

              {/* PRICE */}

              {totalNights > 0 && (
                <div className="booking-summary">
                  <div className="booking-summary-row">
                    <span>
                      ₹{pricePerNight.toLocaleString()} × {totalNights}{" "}
                      {totalNights === 1 ? "night" : "nights"}
                    </span>

                    <strong>₹{totalPrice.toLocaleString()}</strong>
                  </div>

                  <div className="booking-summary-divider"></div>

                  <div className="booking-summary-row booking-total">
                    <span>Total</span>

                    <strong>₹{totalPrice.toLocaleString()}</strong>
                  </div>
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                className="btn btn-primary booking-button"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>
            </form>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default ListingDetails;
