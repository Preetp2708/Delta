const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("../views/listing/index.ejs", { listing: alllistings });
}

module.exports.newListingForm = async (req, res) => {
    res.render('../views/listing/new.ejs');
}

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listing');
  }
  res.render('../views/listing/show.ejs', { listing });
}

module.exports.newListing = async (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressErr(400, "Invalid listing data!");
  }
  const newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id; // Set the owner to the currently logged-in user
  await newlist.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect(`/listing/${newlist._id}`);
}

module.exports.editListingForm = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listing');
  }
    res.render("../views/listing/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressErr(400, "Invalid listing data!");
    }
    const { id } = req.params;
    const data = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...data });
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect("/listing");
}