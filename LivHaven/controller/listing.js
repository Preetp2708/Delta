const Listing = require('../models/listing');
const ExpressErr = require('../utils/ExpressErr.js');

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
  // If a file was uploaded, attach its URL/filename. Be defensive about storage shape.
  if (req.file) {
    const url = req.file.path || req.file.location || req.file.secure_url || req.file.url;
    const filename = req.file.filename || '';
    newlist.image = { url, filename };
  }
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload/', '/upload/h_300,w_300/');
    res.render("../views/listing/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing = async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressErr(400, "Invalid listing data!");
    }
    const { id } = req.params;
    const data = req.body.listing;
    // Return the updated document (new: true) so we can modify it if a file was uploaded
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...data }, { new: true, runValidators: true });
    if (!updatedListing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listing');
    }
    if (req.file) {
      const url = req.file.path || req.file.location || req.file.secure_url || req.file.url;
      const filename = req.file.filename || '';
      updatedListing.image = updatedListing.image || {};
      updatedListing.image.url = url;
      updatedListing.image.filename = filename;
      await updatedListing.save();
    }
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect("/listing");
}