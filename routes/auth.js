const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const isLoggedIn = require("../utils/isLoggedIn");

//Sign Up - New
router.get("/signup", (req, res) =>{
	res.render("signup");
});

//Sign Up POST
router.post("/signup", async (req, res) =>{
	try {
	    const newUser = await User.register(new User(
			{
				email: req.body.email,
				username: req.body.username
			}
	   ), req.body.password);
		console.log(newUser);
		passport.authenticate("local")(req, res, () =>{
			res.redirect("/books");
		})
		
	} catch (err) {
		console.log(err);
		res.send("Error signing up");
		res.redirect("/signup");
	}
});

//Login Form
router.get("/login", (req, res) =>{
	res.render("login");
});

//Login
router.post("/login", passport.authenticate("local", {
	successRedirect: "/books",
	failureRedirect: "/login"
}));

//Logout
router.get("/logout", (req, res) =>{
	req.logout();
	res.redirect("/books");
});


module.exports = router;