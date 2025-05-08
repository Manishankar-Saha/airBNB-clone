const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New route
router.get("/new", (req, res) => {
  // console.log("Handling /listings/new route");
  res.render("listings/new.ejs");
});

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    // console.log("Handling /listings/:id route, ID:", req.params.id);
    let { id } = req.params;
    let details = await Listing.findById(id).populate("reviews");
    // console.log(details);
    if (!details) {
      req.flash("error", "Listing doesn't exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { details });
  })
);

// Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let currDetails = await Listing.findById(id);
    if (!currDetails) {
      req.flash("error", "Listing doesn't exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { currDetails });
  })
);

// Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.body.listing);
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Destroy Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(`Deleted Listing: ${deletedData}`);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
