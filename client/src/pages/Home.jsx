import { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";
import SearchFilters from "../components/SearchFilters";
import "./Home.css";

function Home() {
  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    propertyType: "all",
    minPrice: "",
    maxPrice: "",
    guests: "",
    sort: "newest",
  });

  // =========================
  // FETCH LISTINGS
  // =========================

  const fetchListings = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (currentFilters.search) {
        params.search = currentFilters.search;
      }

      if (
        currentFilters.propertyType &&
        currentFilters.propertyType !== "all"
      ) {
        params.propertyType = currentFilters.propertyType;
      }

      if (currentFilters.minPrice) {
        params.minPrice = currentFilters.minPrice;
      }

      if (currentFilters.maxPrice) {
        params.maxPrice = currentFilters.maxPrice;
      }

      if (currentFilters.guests) {
        params.guests = currentFilters.guests;
      }

      if (currentFilters.sort) {
        params.sort = currentFilters.sort;
      }

      const response = await api.get("/listings", {
        params,
      });

      setListings(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchListings();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (newFilters) => {
    setFilters(newFilters);

    fetchListings(newFilters);
  };

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

          <section className="listings-section">
            <SearchFilters onSearch={handleSearch} />

            <div className="home-state error-state">
              <h2>Something went wrong</h2>

              <p>{error}</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page">
      <div className="home-container">
        {/* =========================
            HERO
        ========================= */}

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

        {/* =========================
            LISTINGS
        ========================= */}

        <section className="listings-section">
          <SearchFilters onSearch={handleSearch} />

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
              <h3>No listings found</h3>

              <p>Try changing your search or filter options.</p>
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
