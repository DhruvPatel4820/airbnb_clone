const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Listing title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Listing description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },

    location: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },

      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },

      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
    },

    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["house", "apartment", "villa", "hotel", "guesthouse", "other"],
    },

    guests: {
      type: Number,
      required: [true, "Guest capacity is required"],
      min: [1, "There must be at least 1 guest"],
    },

    bedrooms: {
      type: Number,
      required: true,
      min: [0, "Bedrooms cannot be negative"],
    },

    bathrooms: {
      type: Number,
      required: true,
      min: [0, "Bathrooms cannot be negative"],
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Listing owner is required"],
      index: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
