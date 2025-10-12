const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressErr = require("./utils/ExpressErr.js");
const session = require('express-session');
const reviewRoutes = require('./routes/review.js');
const listingsRoutes = require('./routes/listing.js');
const flash = require('connect-flash');

// ────────────── Middleware Setup ──────────────
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// ────────────── MongoDB Connection ──────────────
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/LivHaven');
}

main()
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log(err));

// ────────────── Server ──────────────
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// ────────────── Session Configuration ──────────────
const sessionOptions = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie : {
        exprires: Date.now() + 1000 * 60 * 60 * 24 * 7, // One week from now
        maxAge: 1000 * 60 * 60 * 24 * 7, // One week
        httpOnly: true,
      },
};

// Root
app.get('/', (req, res) => {
  res.send('Hello! This Is Root!');
});

app.use(session(sessionOptions));
app.use(flash());

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ────────────── Routes ──────────────

// Use listing routes
app.use('/listing', listingsRoutes);

// Review Routes
app.use('/listing/:id/reviews', reviewRoutes);


// 404 Not Found Handler
app.all('/', (req, res, next) => {
    next(new ExpressErr(404, "Page Not Found! :)"));
});

// Central Error Handler
app.use((err, req, res, next) => {
    console.error(err.status, err.message);
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    res.status(status).render("error.ejs", { status, message });
});
