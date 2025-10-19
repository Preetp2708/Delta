const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const { listingSchema } = require('../schema.js');
const { isLoggedIn, isOwner } = require('../middleWare.js');
const listingController = require('../controller/listing.js');

//  Validation Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        // Show readable Joi error
        throw new ExpressErr(400, error.details[0].message);
    } else {
        next();
    }
};

//  Route: GET all listings / POST new listing
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.newListing));

//  Route: show form to create new listing
router.route('/new')
    .get(isLoggedIn, wrapAsync(listingController.newListingForm));

//  Route: show, update, or delete specific listing
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//  Route: edit form
router.route('/:id/edit')
    .get(isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

module.exports = router;