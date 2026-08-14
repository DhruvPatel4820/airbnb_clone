import { Link } from "react-router-dom";
import "./ListingCard.css";

function ListingCard({ listing }) {
  const imageUrl = listing.images?.[0];

  return (
    <article className="listing-card">
      {/* IMAGE */}

      <div className="listing-card-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="listing-card-img"
          />
        ) : (
          <div className="listing-card-placeholder">
            <span>🏠</span>
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="listing-card-content">
        <div className="listing-card-header">
          <h2>{listing.title}</h2>

          <div className="listing-rating">
            <span>★</span>

            <span>{listing.averageRating || 0}</span>

            <span className="review-count">({listing.totalReviews || 0})</span>
          </div>
        </div>

        <p className="listing-location">
          {listing.location?.city}, {listing.location?.state}
        </p>

        <div className="listing-card-bottom">
          <p className="listing-price">
            <strong>₹{listing.price}</strong>
            <span> / night</span>
          </p>

          <Link to={`/listings/${listing._id}`} className="listing-view-button">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ListingCard;
