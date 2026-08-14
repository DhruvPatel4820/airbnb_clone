import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ListingDetails.css";

function ListingDetails() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  // =========================
  // LISTING STATE
  // =========================

  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // BOOKING STATE
  // =========================

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // =========================
  // REVIEW STATE
  // =========================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);

  // =========================
  // GET LISTING
  // =========================

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${listingId}`);

        setListing(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // =========================
  // GET REVIEWS
  // =========================

  const fetchReviews = async () => {
    try {
      setReviewsError("");

      const response = await api.get(`/reviews/listing/${listingId}`);

      setReviews(response.data.data || []);
    } catch (error) {
      setReviewsError(
        error.response?.data?.message || "Failed to load reviews",
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  // =========================
  // BOOKING FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE BOOKING
  // =========================

  const handleBooking = async (e) => {
    e.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!formData.checkIn || !formData.checkOut) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    if (Number(formData.guests) < 1) {
      setBookingError("Guests must be at least 1.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await api.post("/bookings", {
        listingId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests),
      });

      setBookingSuccess(
        response.data.message || "Booking created successfully!",
      );

      setFormData({
        checkIn: "",
        checkOut: "",
        guests: 1,
      });

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1000);
    } catch (error) {
      setBookingError(
        error.response?.data?.message || "Failed to create booking",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================
  // REVIEW FORM CHANGE
  // =========================

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE / UPDATE REVIEW
  // =========================

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    setReviewError("");
    setReviewMessage("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);

      if (editingReviewId) {
        await api.patch(`/reviews/${editingReviewId}`, {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        });

        setReviewMessage("Review updated successfully.");
      } else {
        await api.post(`/reviews/listing/${listingId}`, {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        });

        setReviewMessage("Review added successfully.");
      }

      setReviewForm({
        rating: 5,
        comment: "",
      });

      setEditingReviewId(null);

      await fetchReviews();
    } catch (error) {
      setReviewError(error.response?.data?.message || "Failed to save review");
    } finally {
      setReviewLoading(false);
    }
  };

  // =========================
  // EDIT REVIEW
  // =========================

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);

    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });

    setReviewError("");
    setReviewMessage("");
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    setEditingReviewId(null);

    setReviewForm({
      rating: 5,
      comment: "",
    });

    setReviewError("");
    setReviewMessage("");
  };

  // =========================
  // DELETE REVIEW
  // =========================

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewError("");
      setReviewMessage("");

      await api.delete(`/reviews/${reviewId}`);

      setReviewMessage("Review deleted successfully.");

      await fetchReviews();
    } catch (error) {
      setReviewError(
        error.response?.data?.message || "Failed to delete review",
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="listing-details-page">
        <div className="container">
          <div className="listing-state">
            <div className="spinner"></div>
            <p>Loading listing...</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="listing-details-page">
        <div className="container">
          <div className="listing-state error-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>

            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="listing-details-page">
        <div className="container">
          <div className="listing-state">
            <h2>Listing not found</h2>
          </div>
        </div>
      </main>
    );
  }

  const images = listing.images || [];

  // =========================
  // UI
  // =========================

  return (
    <main className="listing-details-page">
      <div className="container">
        {/* =========================
            HEADER
        ========================= */}

        <section className="listing-header">
          <h1>{listing.title}</h1>

          <div className="listing-meta">
            <span>
              📍 {listing.location?.city}, {listing.location?.state},{" "}
              {listing.location?.country}
            </span>

            <span>
              ⭐ {listing.averageRating || 0} ({listing.totalReviews || 0}{" "}
              reviews)
            </span>
          </div>
        </section>

        {/* =========================
            IMAGE GALLERY
        ========================= */}

        <section className="listing-gallery">
          {images.length > 0 ? (
            images.slice(0, 5).map((image, index) => (
              <div
                key={index}
                className={`gallery-image gallery-image-${index + 1}`}
              >
                <img src={image} alt={`${listing.title} ${index + 1}`} />
              </div>
            ))
          ) : (
            <div className="gallery-placeholder">
              <span>🏠</span>
              <p>No images available</p>
            </div>
          )}
        </section>

        {/* =========================
            MAIN LAYOUT
        ========================= */}

        <div className="listing-layout">
          {/* =========================
              LEFT CONTENT
          ========================= */}

          <div className="listing-main">
            {/* PROPERTY INFO */}

            <section className="listing-section">
              <div className="property-heading">
                <div>
                  <h2>
                    {listing.propertyType
                      ? listing.propertyType.charAt(0).toUpperCase() +
                        listing.propertyType.slice(1)
                      : "Property"}
                  </h2>

                  <p className="owner-name">
                    {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
                    {listing.bathrooms} bathrooms
                  </p>
                </div>

                <div className="owner-avatar">
                  {listing.owner?.fullName?.charAt(0) ||
                    listing.owner?.username?.charAt(0) ||
                    "U"}
                </div>
              </div>

              <div className="property-stats">
                <div>
                  <span>👥</span>
                  <div>
                    <strong>{listing.guests}</strong>
                    <small> guests</small>
                  </div>
                </div>

                <div>
                  <span>🛏️</span>
                  <div>
                    <strong>{listing.bedrooms}</strong>
                    <small> bedrooms</small>
                  </div>
                </div>

                <div>
                  <span>🛁</span>
                  <div>
                    <strong>{listing.bathrooms}</strong>
                    <small> bathrooms</small>
                  </div>
                </div>
              </div>
            </section>

            {/* DESCRIPTION */}

            <section className="listing-section">
              <h2>About this place</h2>

              <p className="description">{listing.description}</p>
            </section>

            {/* AMENITIES */}

            <section className="listing-section">
              <h2>What this place offers</h2>

              {listing.amenities?.length > 0 ? (
                <div className="amenities-grid">
                  {listing.amenities.map((amenity, index) => (
                    <div className="amenity-item" key={index}>
                      <span>✓</span>
                      <p>{amenity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-text">No amenities listed.</p>
              )}
            </section>

            {/* OWNER */}

            <section className="listing-section">
              <h2>Hosted by</h2>

              <div className="owner-card">
                <div className="owner-avatar owner-avatar-large">
                  {listing.owner?.fullName?.charAt(0) ||
                    listing.owner?.username?.charAt(0) ||
                    "U"}
                </div>

                <div>
                  <h3>
                    {listing.owner?.fullName ||
                      listing.owner?.username ||
                      "Property Owner"}
                  </h3>

                  <p>Property host</p>
                </div>
              </div>
            </section>
          </div>

          {/* =========================
              BOOKING CARD
          ========================= */}

          <aside className="booking-card">
            <div className="booking-price">
              <strong>₹{listing.price}</strong>
              <span> / night</span>
            </div>

            <div className="booking-rating">
              ⭐ {listing.averageRating || 0} ({listing.totalReviews || 0}{" "}
              reviews)
            </div>

            {bookingError && (
              <div className="alert alert-error">{bookingError}</div>
            )}

            {bookingSuccess && (
              <div className="alert alert-success">{bookingSuccess}</div>
            )}

            <form onSubmit={handleBooking}>
              <div className="booking-fields">
                <div className="booking-field">
                  <label htmlFor="checkIn">CHECK-IN</label>

                  <input
                    id="checkIn"
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor="checkOut">CHECK-OUT</label>

                  <input
                    id="checkOut"
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor="guests">GUESTS</label>

                  <input
                    id="guests"
                    type="number"
                    name="guests"
                    min="1"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary booking-button"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>

              <p className="booking-note">You won't be charged yet</p>
            </form>
          </aside>
        </div>

        {/* =========================
            REVIEWS
        ========================= */}

        <section className="listing-section reviews-section">
          <div className="reviews-heading">
            <h2>⭐ {listing.averageRating || 0}</h2>

            <span>{listing.totalReviews || 0} reviews</span>
          </div>

          {/* REVIEW FORM */}

          {isAuthenticated && (
            <form onSubmit={handleReviewSubmit} className="review-form-card">
              <h3>{editingReviewId ? "Edit Your Review" : "Write a Review"}</h3>

              {reviewError && (
                <div className="alert alert-error">{reviewError}</div>
              )}

              {reviewMessage && (
                <div className="alert alert-success">{reviewMessage}</div>
              )}

              <div className="form-group">
                <label htmlFor="rating">Rating</label>

                <select
                  id="rating"
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5</option>

                  <option value="4">⭐⭐⭐⭐ 4</option>

                  <option value="3">⭐⭐⭐ 3</option>

                  <option value="2">⭐⭐ 2</option>

                  <option value="1">⭐ 1</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Comment</label>

                <textarea
                  id="comment"
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  placeholder="Write your review..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reviewLoading}
                >
                  {reviewLoading
                    ? "Saving..."
                    : editingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                </button>

                {editingReviewId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {/* LOGIN MESSAGE */}

          {!isAuthenticated && (
            <div className="login-review-message">
              <p>
                Please{" "}
                <button type="button" onClick={() => navigate("/login")}>
                  login
                </button>{" "}
                to write a review.
              </p>
            </div>
          )}

          {/* REVIEW LIST */}

          <div className="reviews-list">
            {reviewsLoading ? (
              <p className="review-loading">Loading reviews...</p>
            ) : reviewsError ? (
              <p className="muted-text">{reviewsError}</p>
            ) : reviews.length === 0 ? (
              <div className="empty-reviews">
                <span>💬</span>

                <h3>No reviews yet</h3>

                <p>Be the first to review this listing.</p>
              </div>
            ) : (
              reviews.map((review) => {
                const reviewUserId = review.user?._id || review.user;

                const isOwnReview = user?._id === reviewUserId;

                return (
                  <article className="review-card" key={review._id}>
                    <div className="review-header">
                      <div className="review-user">
                        <div className="review-avatar">
                          {review.user?.fullName?.charAt(0) ||
                            review.user?.username?.charAt(0) ||
                            "U"}
                        </div>

                        <div>
                          <h3>
                            {review.user?.fullName ||
                              review.user?.username ||
                              "User"}
                          </h3>

                          <small>
                            {review.createdAt &&
                              new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      <span className="review-rating">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>

                    <p className="review-comment">{review.comment}</p>

                    {isOwnReview && (
                      <div className="review-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleEditReview(review)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ListingDetails;
