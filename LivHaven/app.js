const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const ejsmate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");
const { listingSchema } = require('./schema.js');
const { reviewSchema } = require('./schema.js');

// ────────────── Middleware Setup ──────────────
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ────────────── Validation Middleware ──────────────
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // Show readable Joi error
        throw new ExpressErr(400, error.details[0].message);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // Show readable Joi error
        throw new ExpressErr(400, error.details[0].message);
    } else {
        next();
    }
};

// ────────────── MongoDB Connection ──────────────
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/LivHaven');
}

main()
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log(err));

// ────────────── Server ──────────────
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// ────────────── Routes ──────────────

// Root
app.get('/', (req, res) => {
  res.send('Hello! This Is Root!');
});

// Index – Get all listings
app.get('/listing', wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render('listing/index.ejs', { listing: alllistings });
}));

// New Form
app.get('/listing/new', (req, res) => {
  res.render('listing/new.ejs');
});

// Show one listing
app.get('/listing/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) return next(new ExpressErr(404, "Listing not found"));
  res.render('listing/show.ejs', { listing });
}));

// Create new listing
app.post('/listing', validateListing, wrapAsync(async (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressErr(400, "Invalid listing data!");
  }
  const newlist = new Listing(req.body.listing);
  await newlist.save();
  res.redirect("/listing");
}));

// Edit Form
app.get("/listing/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return next(new ExpressErr(404, "Listing not found"));
    res.render("listing/edit.ejs", { listing });
}));

// Update Listing
app.put("/listing/:id", validateListing, wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressErr(400, "Invalid listing data!");
    }
    const { id } = req.params;
    const data = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...data });
    res.redirect("/listing");
}));

// Delete Listing
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// Add Review
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res, next) => {
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
    res.redirect(`/listing/${req.params.id}`);
}));

// Delete Review
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressErr(404, "Listing not found"));
    }
    listing.reviews.pull(reviewId);
    await Review.findByIdAndDelete(reviewId);
    await listing.save();
    res.redirect(`/listing/${id}`);
}));

// 404 Not Found Handler
app.use((req, res, next) => {
    next(new ExpressErr(404, "Page Not Found! :)"));
});

// Central Error Handler
app.use((err, req, res, next) => {
    console.error(err.status, err.message);
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    res.status(status).render("error.ejs", { status, message });
});
