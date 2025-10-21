const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

// Listing Schema

const listingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String,},
    image: {
      url: String,
      filename: String,
    },
    price: { type: Number},
    location: { type: String},
    country: { type: String},
    createdAt: { type: Date, default: Date.now },
    reviews: [{
      type : Schema.Types.ObjectId,
      ref: "Review" 
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
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
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

module.exports = Listing;
