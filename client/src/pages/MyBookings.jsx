import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await api.get("/bookings/my-bookings");

      setBookings(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setError("");

      await api.patch(`/bookings/${bookingId}/cancel`);

      await fetchBookings();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <main className="my-bookings-page">
        <div className="container">
          <div className="booking-state">
            <div className="spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-bookings-page">
      <div className="container">
        {/* HEADER */}

        <div className="my-bookings-header">
          <div>
            <h1>My Bookings</h1>

            <p>Manage your upcoming and previous stays.</p>
          </div>

          <Link to="/" className="btn btn-primary">
            Explore Listings
          </Link>
        </div>

        {/* ERROR */}

        {error && <div className="booking-error">{error}</div>}

        {/* EMPTY STATE */}

        {bookings.length === 0 ? (
          <div className="empty-bookings">
            <div className="empty-bookings-icon">📅</div>

            <h2>No bookings yet</h2>

            <p>
              You haven't booked a stay yet. Explore available properties and
              find your next place to stay.
            </p>

            <Link to="/" className="btn btn-primary">
              Explore Listings
            </Link>
          </div>
        ) : (
          /* BOOKINGS */

          <div className="bookings-list">
            {bookings.map((booking) => {
              const listing = booking.listing;

              return (
                <article className="booking-card" key={booking._id}>
                  {/* IMAGE */}

                  <div className="booking-image">
                    {listing?.images?.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} />
                    ) : (
                      <div className="booking-image-placeholder">
                        <span>🏠</span>
                        <p>No image</p>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="booking-content">
                    {/* TOP */}

                    <div className="booking-top">
                      <div>
                        <h2>{listing?.title || "Listing unavailable"}</h2>

                        <p className="booking-location">
                          📍 {listing?.location?.city || "Unknown"},{" "}
                          {listing?.location?.state || ""}
                        </p>
                      </div>

                      <span
                        className={`booking-status status-${booking.status}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* DETAILS */}

                    <div className="booking-details">
                      <div className="booking-detail">
                        <span>Check-in</span>

                        <strong>
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </strong>
                      </div>

                      <div className="booking-detail">
                        <span>Check-out</span>

                        <strong>
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </strong>
                      </div>

                      <div className="booking-detail">
                        <span>Guests</span>

                        <strong>{booking.guests}</strong>
                      </div>

                      <div className="booking-detail">
                        <span>Total Nights</span>

                        <strong>{booking.totalNights}</strong>
                      </div>
                    </div>

                    {/* FOOTER */}

                    <div className="booking-footer">
                      <div className="booking-price">
                        <span>Total price</span>

                        <strong>₹{booking.totalPrice}</strong>
                      </div>

                      <div className="booking-actions">
                        {listing?._id && (
                          <Link
                            to={`/listings/${listing._id}`}
                            className="btn btn-secondary"
                          >
                            View Listing
                          </Link>
                        )}

                        {(booking.status === "confirmed" ||
                          booking.status === "pending") && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                          >
                            {cancellingId === booking._id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;
