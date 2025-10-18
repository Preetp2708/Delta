const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { isLoggedIn } = require("../middleWare.js");
const { saveRedirectUrl } = require("../middleWare.js");

// Sign Up Form

router.get("/signup" , (req , res) => {
    res.render("user/signup.ejs");
})
router.post("/signup" , wrapAsync(async (req , res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        // Automatically log in the user after successful registration
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome, ${newUser.username} 😊 to LivHaven!`);
            res.redirect('/listing');
        });
        
    } catch (error) {
        if(error.name === 'UserExistsError'){
            req.flash('error', 'A user with the given email is already registered');
            return res.redirect('/signup');
        }
        else if (error.name === 'ValidationError') {
            req.flash('error', 'Please fill in all fields');
            return res.redirect('/signup');
        }else{
        req.flash('error', 'Something went wrong');
        res.redirect('/signup');
        }
    }

}));
router.get("/login" , (req , res) => {
    res.render("user/login.ejs");
});
router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req , res) => {
    req.flash('success', `Welcome, back! ${req.user.username} 😊`);
    let redirectUrl = res.locals.redirectUrl;
    res.redirect(redirectUrl || '/listing');
});

//logout route
router.get("/logout" , (req , res) => {
    // Use callback form to ensure logout completes and to handle errors
    req.logout(function(err) {
        if (err) {
            req.flash('error', 'Failed to log out. Please try again.');
            return res.redirect('/listing');
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listing');
    });
});


module.exports = router;
