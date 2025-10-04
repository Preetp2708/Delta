const express = require('express');
const app = express();
const port = 1000;
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
app.get('/listings', async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', { listings: alllistings });

});
//new route to get the form to create a new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});


//show route to get a single listing by id
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
});


//create route to create a new listing
app.post('/listings', async (req, res) => {
    const newlist = new Listing (req.body.listing);
    await newlist.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body.listing;
  await Listing.findByIdAndUpdate(id, {...data});
  res.redirect("/listings");
});

//delete route to delete a listing by id
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
