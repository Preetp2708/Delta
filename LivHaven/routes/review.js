const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { reviewSchema } = require('../schema.js');
const { isLoggedIn } = require('../middleWare.js');
const { isOwnerOfReview } = require('../middleWare.js');

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
router.post("/", validateReview, isLoggedIn, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new ExpressErr(404, "Listing not found"));
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // ✅ Attach logged-in user as author

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash('success', 'Review added successfully!');
    res.redirect(`/listing/${req.params.id}`);
}));


// Delete Review
router.delete("/:reviewId", isLoggedIn, isOwnerOfReview, wrapAsync(async (req, res, next) => {
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