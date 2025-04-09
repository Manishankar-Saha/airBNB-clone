//setting up
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main().then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.log(err);
})

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

// Index Route
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})

// New route
app.get("/listings/new", (req, res) => {
    // console.log("Handling /listings/new route");
    res.render("listings/new.ejs");
})

// Show route
app.get("/listings/:id", async(req, res) => {
    // console.log("Handling /listings/:id route, ID:", req.params.id);
    let {id} = req.params;
    let details = await Listing.findById(id);
    // console.log(details);
    res.render("listings/show.ejs", {details});
});

// Create Route
app.post("/listings", async (req, res) => {
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
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async(req, res) => {
    let {id} = req.params;
    let currDetails = await Listing.findById(id);
    res.render("listings/edit.ejs", {currDetails});
});

// Update Route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true, new: true});
    res.redirect(`/listings/${id}`);
});

// Destroy Route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(`Deleted Listing: ${deletedData}`);
    res.redirect("/listings");
})






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



app.get("/", (req, res) => {
    res.send("Root is working")
});

app.listen(port, () => {
    console.log("Server in listening on port 8080");
});

