const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
  saveRedirectUrl,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
// Reviews
// Post Review Route
router.post(
  "/", // we have to cut the common part from routes , here it is -> /listings/:id/reviews
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  saveRedirectUrl,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
