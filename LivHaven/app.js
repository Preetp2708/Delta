const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const { v4: uuidv4 } = require('uuid');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ejsmate = require('ejs-mate');
app.engine('ejs', ejsmate);
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");
const { listingSchema } = require('./schema.js');
const { request } = require('http');

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressErr(400 , error);
    }else{
    next();
    }
};

//connect to mongodb

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/LivHaven');
}

main().then((res) =>{
    console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


//root route
app.get('/', (req, res) => {
    res.send('Hello! This Is Root!');
});

//index route to get all listings
app.get('/listing', wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listing/index.ejs', { listing: alllistings });

}));
app.get('/listing/new', wrapAsync(async (req, res) => {
    res.render('listing/new.ejs');
}));


//show route to get a single listing by id
app.get('/listing/:id', wrapAsync(async (req, res , next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressErr(404, "Listing not found"));
    }
    res.render('listing/show.ejs', { listing });
}));


//create route to create a new listing

app.post('/listing', validateListing, wrapAsync(async (req, res, next) => {
    if(!req.body){
            throw new ExpressErr(400 , "You don't pass right data!");
    }
    const newlist = new Listing(req.body.listing);
    await newlist.save();
    res.redirect("/listing");
}));


//Edit Route
app.get("/listing/:id/edit", wrapAsync(async (req, res , next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

//Update Route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res , next) => {
    if(!req.body){
            throw new ExpressErr(400 , "You don't pass right data!");
    }
    const { id } = req.params;
    const data = req.body.listing;
    await Listing.findByIdAndUpdate(id, {...data});
    res.redirect("/listing");
}));

//delete route to delete a listing by id
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

app.use("/" , (req , res , next) => {
    next(new ExpressErr(404 , "Page Not Found!:)"));
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.status , err.message);
  const status = err.status;
  const message = err.message;
  res.status(status).render("error.ejs", { status, message});
});
