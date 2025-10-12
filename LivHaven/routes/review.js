const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { reviewSchema } = require('../schema.js');

// Validation Middleware

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // Show readable Joi error
        throw new ExpressErr(400, error.details[0].message);
    } else {
        next();
    }
};

// Add Review
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    if (!listing) {
      return next(new ExpressErr(404, "Listing not found"));
    }
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(req.body);
    console.log(req.params);
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listing/${req.params.id}`);
}));

// Delete Review
router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
    const { reviewId } = req.params;
    const { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(new ExpressErr(404, "Listing not found"));
    }
    listing.reviews.pull(reviewId);
    await Review.findByIdAndDelete(reviewId);
    await listing.save();
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listing/${id}`);
}));

module.exports = router;