import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateListing.css";

function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    state: "",
    country: "",
    propertyType: "apartment",
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // CLEANUP PREVIEWS
  // =========================

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setError("");

    if (files.length > 5) {
      setError("You can upload maximum 5 images.");

      e.target.value = "";
      return;
    }

    const invalidFile = files.find((file) => file.size > 5 * 1024 * 1024);

    if (invalidFile) {
      setError("Each image must be smaller than 5MB.");

      e.target.value = "";
      return;
    }

    const invalidType = files.find((file) => !file.type.startsWith("image/"));

    if (invalidType) {
      setError("Only image files are allowed.");

      e.target.value = "";
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData((previous) => ({
      ...previous,
      images: files,
    }));

    setImagePreviews(previews);
  };

  // =========================
  // CREATE LISTING
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const data = new FormData();

      // =========================
      // BASIC INFORMATION
      // =========================

      data.append("title", formData.title);

      data.append("description", formData.description);

      data.append("price", formData.price);

      // =========================
      // LOCATION
      // =========================

      data.append(
        "location",
        JSON.stringify({
          city: formData.city,
          state: formData.state,
          country: formData.country,
        }),
      );

      // =========================
      // PROPERTY DETAILS
      // =========================

      data.append("propertyType", formData.propertyType);

      data.append("guests", formData.guests);

      data.append("bedrooms", formData.bedrooms);

      data.append("bathrooms", formData.bathrooms);

      // =========================
      // AMENITIES
      // =========================

      const amenities = formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("amenities", JSON.stringify(amenities));

      // =========================
      // IMAGES
      // =========================

      formData.images.forEach((file) => {
        data.append("images", file);
      });

      // =========================
      // API REQUEST
      // =========================

      const response = await api.post("/listings", data);

      const createdListing = response.data.data;

      navigate(`/listings/${createdListing._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-listing-page">
      <div className="container">
        <div className="create-listing-header">
          <h1>Create a Listing</h1>

          <p>
            Share your place with travelers and create a memorable experience.
          </p>
        </div>

        <div className="create-listing-card">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="listing-form">
            {/* BASIC INFORMATION */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Basic Information</h2>

                <p>Tell guests about your property.</p>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Cozy apartment in Lucknow"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price per night</label>

                <div className="price-input">
                  <span>₹</span>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2500"
                    required
                  />
                </div>
              </div>
            </section>

            {/* LOCATION */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Location</h2>

                <p>Where is your property located?</p>
              </div>

              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label htmlFor="city">City</label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Lucknow"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Uttar Pradesh"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>

                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    required
                  />
                </div>
              </div>
            </section>

            {/* PROPERTY DETAILS */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Property Details</h2>

                <p>Give guests some important details.</p>
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">Property Type</label>

                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="house">House</option>

                  <option value="apartment">Apartment</option>

                  <option value="villa">Villa</option>

                  <option value="hotel">Hotel</option>

                  <option value="guesthouse">Guesthouse</option>

                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>

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

                <div className="form-group">
                  <label htmlFor="bedrooms">Bedrooms</label>

                  <input
                    id="bedrooms"
                    type="number"
                    name="bedrooms"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bathrooms">Bathrooms</label>

                  <input
                    id="bathrooms"
                    type="number"
                    name="bathrooms"
                    min="0"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* AMENITIES */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Amenities</h2>

                <p>Add facilities available at your property.</p>
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities</label>

                <input
                  id="amenities"
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, AC, Parking, Kitchen"
                />

                <small>Separate multiple amenities with commas.</small>
              </div>
            </section>

            {/* IMAGES */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Property Images</h2>

                <p>Upload images of your property.</p>
              </div>

              <div className="form-group">
                <label htmlFor="images">Property Images</label>

                <input
                  id="images"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                <small>Maximum 5 images. Maximum 5MB per image.</small>
              </div>

              {imagePreviews.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "12px",
                    marginTop: "15px",
                  }}
                >
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={preview}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ACTIONS */}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary create-listing-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateListing;
