import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./MyListings.css";

function MyListings() {
  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/listings/my-listings");

      const allListings = response.data.data || [];

      setListings(allListings);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (listingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/listings/${listingId}`);

      setListings((currentListings) =>
        currentListings.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <main className="my-listings-page">
        <div className="container">
          <div className="listings-state">
            <div className="spinner"></div>
            <p>Loading your listings...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-listings-page">
        <div className="container">
          <div className="listings-state error-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchMyListings}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-listings-page">
      <div className="container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="my-listings-header">
          <div>
            <h1>My Listings</h1>

            <p>Manage the properties you have listed on the platform.</p>
          </div>

          <Link to="/listings/create" className="btn btn-primary">
            + Create New Listing
          </Link>
        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {listings.length === 0 ? (
          <div className="empty-listings">
            <div className="empty-icon">🏠</div>

            <h2>No listings yet</h2>

            <p>
              You haven't created any listings yet. Start by adding your first
              property.
            </p>

            <Link to="/listings/create" className="btn btn-primary">
              Create Your First Listing
            </Link>
          </div>
        ) : (
          /* =========================
              LISTINGS GRID
          ========================= */

          <div className="my-listings-grid">
            {listings.map((listing) => (
              <article className="my-listing-card" key={listing._id}>
                {/* IMAGE */}

                <div className="my-listing-image">
                  {listing.images?.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} />
                  ) : (
                    <div className="image-placeholder">
                      <span>🏠</span>
                      <p>No image</p>
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="my-listing-content">
                  <div className="my-listing-top">
                    <span className="property-type">
                      {listing.propertyType
                        ? listing.propertyType.charAt(0).toUpperCase() +
                          listing.propertyType.slice(1)
                        : "Property"}
                    </span>

                    <span className="listing-rating">
                      ⭐ {listing.averageRating || 0}
                    </span>
                  </div>

                  <h2>{listing.title}</h2>

                  <p className="listing-location">
                    📍 {listing.location?.city}, {listing.location?.state}
                  </p>

                  <div className="listing-details">
                    <span>{listing.guests} guests</span>

                    <span>{listing.bedrooms} bedrooms</span>

                    <span>{listing.bathrooms} bathrooms</span>
                  </div>

                  <div className="listing-price">
                    <strong>₹{listing.price}</strong>

                    <span> / night</span>
                  </div>

                  <div className="listing-reviews">
                    ⭐ {listing.averageRating || 0} ·{" "}
                    {listing.totalReviews || 0} reviews
                  </div>

                  {/* ACTIONS */}

                  <div className="my-listing-actions">
                    <Link
                      to={`/listings/${listing._id}`}
                      className="btn btn-primary"
                    >
                      View
                    </Link>

                    <Link
                      to={`/listings/${listing._id}/edit`}
                      className="btn btn-secondary"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(listing._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyListings;
