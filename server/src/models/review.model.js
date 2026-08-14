const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [5, "Comment must be at least 5 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// One user can review a listing only once
reviewSchema.index({ user: 1, listing: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
