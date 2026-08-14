import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Admin.css";

function Admin() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // TOGGLE USER STATUS
  // =========================

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setError("");

      await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                isActive: !currentStatus,
              }
            : user,
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user status");
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/admin/users/${userId}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };

  // =========================
  // TOGGLE LISTING STATUS
  // =========================

  const handleToggleListingStatus = async (listingId, currentStatus) => {
    try {
      setError("");

      await api.patch(`/admin/listings/${listingId}/status`, {
        isActive: !currentStatus,
      });

      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === listingId
            ? {
                ...listing,
                isActive: !currentStatus,
              }
            : listing,
        ),
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update listing status",
      );
    }
  };

  // =========================
  // DELETE LISTING
  // =========================

  const handleDeleteListing = async (listingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/admin/listings/${listingId}`);

      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete listing");
    }
  };

  // =========================
  // FETCH ADMIN DATA
  // =========================

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          usersResponse,
          listingsResponse,
          bookingsResponse,
          reviewsResponse,
        ] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/listings"),
          api.get("/admin/bookings"),
          api.get("/admin/reviews"),
        ]);

        setUsers(usersResponse.data.data || []);
        setListings(listingsResponse.data.data || []);
        setBookings(bookingsResponse.data.data || []);
        setReviews(reviewsResponse.data.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load admin dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-state">
          <div className="admin-spinner"></div>
          <h2>Loading admin dashboard...</h2>
          <p>Please wait while we load the dashboard.</p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-state admin-error-state">
          <div className="admin-error-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="admin-page">
      <div className="container admin-container">
        {/* =========================
            HEADER
        ========================= */}

        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">ADMIN PANEL</span>

            <h1>Admin Dashboard</h1>

            <p>Manage users, listings, bookings and reviews from one place.</p>
          </div>

          <div className="admin-welcome">
            <span>Welcome back</span>

            <strong>{user?.fullName || user?.username || "Admin"}</strong>
          </div>
        </header>

        {/* =========================
            SUMMARY
        ========================= */}

        <section className="admin-summary">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">U</div>

            <div>
              <span>Total Users</span>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">L</div>

            <div>
              <span>Total Listings</span>
              <h2>{listings.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">B</div>

            <div>
              <span>Total Bookings</span>
              <h2>{bookings.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">R</div>

            <div>
              <span>Total Reviews</span>
              <h2>{reviews.length}</h2>
            </div>
          </div>
        </section>

        {/* =========================
            USERS
        ========================= */}

        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">USER MANAGEMENT</span>

              <h2>Users</h2>
            </div>

            <span className="section-count">{users.length} users</span>
          </div>

          {users.length === 0 ? (
            <div className="admin-empty">
              <h3>No users found</h3>
              <p>There are currently no users to display.</p>
            </div>
          ) : (
            <div className="admin-list">
              {users.map((user) => (
                <div className="admin-item user-item" key={user._id}>
                  <div className="admin-item-main">
                    <div className="admin-avatar">
                      {(user.fullName || user.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="admin-item-content">
                      <h3>
                        {user.fullName || user.username || "Unknown User"}
                      </h3>

                      <p>{user.email}</p>

                      <div className="admin-meta">
                        <span>Role: {user.role}</span>

                        <span
                          className={
                            user.isActive
                              ? "status status-active"
                              : "status status-inactive"
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user.role !== "admin" && (
                    <div className="admin-actions">
                      <button
                        className={
                          user.isActive
                            ? "admin-btn admin-btn-warning"
                            : "admin-btn admin-btn-success"
                        }
                        onClick={() =>
                          handleToggleUserStatus(user._id, user.isActive)
                        }
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================
            LISTINGS
        ========================= */}

        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">LISTING MANAGEMENT</span>

              <h2>Listings</h2>
            </div>

            <span className="section-count">{listings.length} listings</span>
          </div>

          {listings.length === 0 ? (
            <div className="admin-empty">
              <h3>No listings found</h3>
              <p>There are currently no listings to display.</p>
            </div>
          ) : (
            <div className="admin-list">
              {listings.map((listing) => (
                <div className="admin-item listing-item" key={listing._id}>
                  <div className="admin-item-content">
                    <div className="listing-title-row">
                      <h3>{listing.title}</h3>

                      <span
                        className={
                          listing.isActive
                            ? "status status-active"
                            : "status status-inactive"
                        }
                      >
                        {listing.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="listing-details">
                      <span>₹{listing.price} / night</span>

                      <span>
                        Owner:{" "}
                        {listing.owner?.fullName ||
                          listing.owner?.username ||
                          "Unknown"}
                      </span>

                      <span>
                        {listing.location?.city}, {listing.location?.state},{" "}
                        {listing.location?.country}
                      </span>
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button
                      className={
                        listing.isActive
                          ? "admin-btn admin-btn-warning"
                          : "admin-btn admin-btn-success"
                      }
                      onClick={() =>
                        handleToggleListingStatus(listing._id, listing.isActive)
                      }
                    >
                      {listing.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDeleteListing(listing._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================
            BOOKINGS
        ========================= */}

        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">BOOKING MANAGEMENT</span>

              <h2>Bookings</h2>
            </div>

            <span className="section-count">{bookings.length} bookings</span>
          </div>

          {bookings.length === 0 ? (
            <div className="admin-empty">
              <h3>No bookings found</h3>
              <p>There are currently no bookings to display.</p>
            </div>
          ) : (
            <div className="admin-list">
              {bookings.map((booking) => (
                <div className="admin-item" key={booking._id}>
                  <div className="admin-item-content">
                    <h3>{booking.listing?.title || "Listing"}</h3>

                    <div className="listing-details">
                      <span>
                        User:{" "}
                        {booking.user?.fullName ||
                          booking.user?.username ||
                          "Unknown"}
                      </span>

                      <span>Total: ₹{booking.totalPrice}</span>

                      <span>
                        Status:{" "}
                        <strong className="booking-status">
                          {booking.status}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================
            REVIEWS
        ========================= */}

        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">REVIEW MANAGEMENT</span>

              <h2>Reviews</h2>
            </div>

            <span className="section-count">{reviews.length} reviews</span>
          </div>

          {reviews.length === 0 ? (
            <div className="admin-empty">
              <h3>No reviews found</h3>
              <p>There are currently no reviews to display.</p>
            </div>
          ) : (
            <div className="admin-list">
              {reviews.map((review) => (
                <div className="admin-item review-item" key={review._id}>
                  <div className="review-header">
                    <div>
                      <h3>
                        {review.user?.fullName ||
                          review.user?.username ||
                          "User"}
                      </h3>

                      <p>Listing: {review.listing?.title || "Listing"}</p>
                    </div>

                    <span className="review-rating">
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>

                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Admin;
