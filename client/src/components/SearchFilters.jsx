import { useState } from "react";
import "./SearchFilters.css";

function SearchFilters({ onSearch }) {
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");
  const [sort, setSort] = useState("newest");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch({
      search: search.trim(),
      propertyType,
      minPrice,
      maxPrice,
      guests,
      sort,
    });
  };

  const handleReset = () => {
    setSearch("");
    setPropertyType("all");
    setMinPrice("");
    setMaxPrice("");
    setGuests("");
    setSort("newest");

    onSearch({
      search: "",
      propertyType: "all",
      minPrice: "",
      maxPrice: "",
      guests: "",
      sort: "newest",
    });
  };

  return (
    <form className="search-filters" onSubmit={handleSubmit}>
      {/* SEARCH */}

      <div className="filter-group search-group">
        <label htmlFor="listing-search">Where</label>

        <input
          id="listing-search"
          type="text"
          placeholder="Search city, state or property..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* PROPERTY TYPE */}

      <div className="filter-group">
        <label htmlFor="property-type">Property Type</label>

        <select
          id="property-type"
          value={propertyType}
          onChange={(event) => setPropertyType(event.target.value)}
        >
          <option value="all">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="hotel">Hotel</option>
          <option value="guesthouse">Guesthouse</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* MIN PRICE */}

      <div className="filter-group">
        <label htmlFor="min-price">Min Price</label>

        <input
          id="min-price"
          type="number"
          min="0"
          placeholder="₹0"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
      </div>

      {/* MAX PRICE */}

      <div className="filter-group">
        <label htmlFor="max-price">Max Price</label>

        <input
          id="max-price"
          type="number"
          min="0"
          placeholder="₹50000"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
      </div>

      {/* GUESTS */}

      <div className="filter-group">
        <label htmlFor="guests">Guests</label>

        <input
          id="guests"
          type="number"
          min="1"
          placeholder="2"
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
        />
      </div>

      {/* SORT */}

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>

        <select
          id="sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* ACTIONS */}

      <div className="filter-actions">
        <button type="submit" className="search-button">
          Search
        </button>

        <button type="button" className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default SearchFilters;
