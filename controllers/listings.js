const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showAllListings = async (req, res) => {
  // console.log("Handling /listings/:id route, ID:", req.params.id);
  let { id } = req.params;
  let details = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log(details);
  if (!details) {
    req.flash("error", "Listing doesn't exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { details });
};

module.exports.createNewListing = async (req, res, next) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  // console.log(newListing);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let currDetails = await Listing.findById(id);
  if (!currDetails) {
    req.flash("error", "Listing doesn't exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { currDetails });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // console.log(req.body.listing);

  await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedData = await Listing.findByIdAndDelete(id);
  console.log(`Deleted Listing: ${deletedData}`);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
