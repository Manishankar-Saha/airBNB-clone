//setting up
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("Root is working");
});

// Schema validation middleware
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
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New route
app.get("/listings/new", (req, res) => {
  // console.log("Handling /listings/new route");
  res.render("listings/new.ejs");
});

// Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    // console.log("Handling /listings/:id route, ID:", req.params.id);
    let { id } = req.params;
    let details = await Listing.findById(id);
    // console.log(details);
    res.render("listings/show.ejs", { details });
  })
);

// Create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    // let newListing = new Listing ({
    //     title: title,
    //     description: description,
    //     price: price,
    //     location: location,
    //     country: country
    // });
    // await newListing.save().then((res) => {
    //     console.log(`added ${res}`)
    // }).catch(err => {
    //     console.log(err);
    // });
    // res.redirect("/listings");

    //or
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing");
    // }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
  })
);

// Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let currDetails = await Listing.findById(id);
    res.render("listings/edit.ejs", { currDetails });
  })
);

// Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.body.listing);
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );
    res.redirect(`/listings/${id}`);
  })
);

// Destroy Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(`Deleted Listing: ${deletedData}`);
    res.redirect("/listings");
  })
);

// Create models (in 'models' dir.)
// then -->
// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing ({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Testing Successful")
// })

// Error for test
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Default Error" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log("Server in listening on port 8080");
});
