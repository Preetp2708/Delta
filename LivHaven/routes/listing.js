const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Listing = require('../models/listing.js');
const { listingSchema } = require('../schema.js');

// Validation Middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // Show readable Joi error
        throw new ExpressErr(400, error.details[0].message);
    } else {
        next();
    }
};

// Index – Get all listings
router.get('/', wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("../views/listing/index.ejs", { listing: alllistings });
}));

// New Form
router.get('/new', (req, res) => {
  res.render('../views/listing/new.ejs');
});

// Show one listing
router.get('/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) return next(new ExpressErr(404, "Listing not found"));
  res.render('../views/listing/show.ejs', { listing });
}));

// Create new listing
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressErr(400, "Invalid listing data!");
  }
  const newlist = new Listing(req.body.listing);
  await newlist.save();
  res.redirect(`/listing/${newlist._id}`);
}));

// Edit Form
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return next(new ExpressErr(404, "Listing not found"));
    res.render("../views/listing/edit.ejs", { listing });
}));

// Update Listing
router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressErr(400, "Invalid listing data!");
    }
    const { id } = req.params;
    const data = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...data });
    res.redirect(`/listing/${id}`);
}));

// Delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

module.exports = router;