const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

// Define a constant for the default image URL
const DEFAULT_IMAGE_URL = "https://cf.bstatic.com/xdata/images/hotel/max1024x768/656411102.jpg?k=7e1185b2b5cee354505b239d9266d7b4e14922dcc32f66404c06554bacdbac1a&o=";

// ----------------------
// Image Schema
// ----------------------
const imageSchema = new Schema(
  {
    filename: { type: String, default: "" },
    url: { type: String, default: DEFAULT_IMAGE_URL }
  },
  { _id: false }
);

// ----------------------
// Listing Schema
// ----------------------
const listingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String,},

    // Image field uses imageSchema
    image: {
      type: imageSchema,
      default: () => ({ url: DEFAULT_IMAGE_URL, filename: "" }),
      set: (value) => {
  // If a string (URL) is provided, convert it into an object with url and filename
  if (typeof value === "string") {
    // If the string is empty, use the default image instead
    if (value.trim() === "") {
      return { url: DEFAULT_IMAGE_URL, filename: "" };
    }
    return { url: value, filename: "" };
  }
  // If image is undefined or null, also use default
  if (!value || !value.url) {
    return { url: DEFAULT_IMAGE_URL, filename: "" };
  }
  return value;
}

    },

    price: { type: Number},
    location: { type: String},
    country: { type: String},
    createdAt: { type: Date, default: Date.now },
    reviews: [{
      type : Schema.Types.ObjectId,
      ref: "Review" 
    }],
  }
);

listingSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    });
  }
});

// Use existing compiled model
const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);

module.exports = Listing;
