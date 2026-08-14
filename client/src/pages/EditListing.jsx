import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "./EditListing.css";

function EditListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    state: "",
    country: "",
    propertyType: "house",
    guests: 1,
    bedrooms: 0,
    bathrooms: 0,
    amenities: "",
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);

  const [newImages, setNewImages] = useState([]);

  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // FETCH LISTING
  // =========================

  useEffect(() => {
    let mounted = true;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/listings/${listingId}`);

        const listing = response.data.data;

        if (!mounted) return;

        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",

          city: listing.location?.city || "",

          state: listing.location?.state || "",

          country: listing.location?.country || "",

          propertyType: listing.propertyType || "house",

          guests: listing.guests || 1,

          bedrooms: listing.bedrooms ?? 0,

          bathrooms: listing.bathrooms ?? 0,

          amenities: listing.amenities?.join(", ") || "",

          images: [],
        });

        setExistingImages(Array.isArray(listing.images) ? listing.images : []);
      } catch (error) {
        if (!mounted) return;

        setError(error.response?.data?.message || "Failed to load listing");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchListing();

    return () => {
      mounted = false;
    };
  }, [listingId]);

  // =========================
  // CLEANUP PREVIEWS
  // =========================

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [newImagePreviews]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // REMOVE EXISTING IMAGE
  // =========================

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages((previous) =>
      previous.filter((image) => image !== imageUrl),
    );
  };

  // =========================
  // HANDLE NEW IMAGES
  // =========================

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);

    setError("");

    if (existingImages.length + files.length > 5) {
      setError("A listing can have maximum 5 images.");

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

    setNewImages(files);

    setNewImagePreviews(previews);
  };

  // =========================
  // UPDATE LISTING
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

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
      // EXISTING IMAGES
      // =========================

      existingImages.forEach((image) => {
        data.append("existingImages", image);
      });

      // =========================
      // NEW IMAGES
      // =========================

      newImages.forEach((file) => {
        data.append("images", file);
      });

      // =========================
      // API REQUEST
      // =========================

      const response = await api.patch(`/listings/${listingId}`, data);

      setSuccess(response.data.message || "Listing updated successfully");

      setTimeout(() => {
        navigate("/my-listings");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update listing");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="edit-listing-page">
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
  // ERROR STATE
  // =========================

  if (error && !formData.title) {
    return (
      <main className="edit-listing-page">
        <div className="container">
          <div className="listing-state">
            <div className="alert alert-error">{error}</div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="edit-listing-page">
      <div className="container">
        <div className="edit-listing-header">
          <h1>Edit Your Listing</h1>

          <p>
            Update your property details and keep your listing information up to
            date.
          </p>
        </div>

        <div className="edit-listing-card">
          {error && <div className="alert alert-error">{error}</div>}

          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="edit-listing-form">
            {/* BASIC INFORMATION */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Basic Information</h2>

                <p>Update the basic information of your property.</p>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
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
                    name="price"
                    type="number"
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

                <p>Update the location of your property.</p>
              </div>

              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label htmlFor="city">City</label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* PROPERTY DETAILS */}

            <section className="form-section">
              <div className="form-section-header">
                <h2>Property Details</h2>

                <p>Update the important details of your property.</p>
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
                    name="guests"
                    type="number"
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
                    name="bedrooms"
                    type="number"
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
                    name="bathrooms"
                    type="number"
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

                <p>Update the facilities available at your property.</p>
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities</label>

                <input
                  id="amenities"
                  name="amenities"
                  type="text"
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

                <p>Manage existing images or upload new ones.</p>
              </div>

              {/* EXISTING IMAGES */}

              {existingImages.length > 0 && (
                <div className="form-group">
                  <label>Existing Images</label>

                  <div className="image-grid">
                    {existingImages.map((image, index) => (
                      <div key={image} className="image-item">
                        <img src={image} alt={`Property ${index + 1}`} />

                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image)}
                          disabled={submitting}
                          className="remove-image-button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW IMAGES */}

              <div className="form-group">
                <label htmlFor="newImages">Add New Images</label>

                <input
                  id="newImages"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleNewImageChange}
                  disabled={submitting}
                />

                <small>Maximum 5 images total. Maximum 5MB per image.</small>
              </div>

              {/* NEW IMAGE PREVIEW */}

              {newImagePreviews.length > 0 && (
                <div className="form-group">
                  <label>New Images</label>

                  <div className="image-grid">
                    {newImagePreviews.map((preview, index) => (
                      <div key={preview} className="image-item">
                        <img src={preview} alt={`New ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ACTIONS */}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary update-listing-button"
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default EditListing;
