import { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";
import "./Home.css";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get("/listings");

        setListings(response.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <main className="home-page">
        <div className="home-container">
          <div className="home-state">
            <div className="loading-spinner"></div>
            <p>Loading listings...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <div className="home-container">
          <div className="home-state error-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page">
      <div className="home-container">
        {/* HERO */}

        <section className="home-hero">
          <div>
            <p className="hero-label">WELCOME TO WANDERLUST</p>

            <h1>Find your perfect stay</h1>

            <p className="hero-description">
              Discover beautiful places, comfortable stays, and unforgettable
              experiences.
            </p>
          </div>
        </section>

        {/* LISTINGS */}

        <section className="listings-section">
          <div className="section-header">
            <div>
              <h2>Explore Listings</h2>

              <p>
                {listings.length} {listings.length === 1 ? "place" : "places"}{" "}
                available
              </p>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="empty-state">
              <h3>No listings available</h3>

              <p>
                There are currently no places available. Please check again
                later.
              </p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;
