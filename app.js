//====================
//IMPORTS
//====================


//NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

// Config Import
try {
	var config = require('./config');
} catch (e) {
	console.log("Could not import config. This means you are not working locally.");
	console.log(e);
}


// Route Imports
const bookRoutes = require("./routes/books");
const commentRoutes = require("./routes/comments");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

//Model Imports
const Book = require("./models/book");
const Comment = require("./models/comment");
const User = require("./models/user");


//====================
// DEV
//====================
app.use(morgan('tiny'));

//Seed the DB
//const seed = require("./utils/seed")
//seed();


//====================
// CONFIG
//====================

// Connect to DB
try {
	mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} catch (e) {
	console.log("Could not connect using config. This means you are not working locally.")
	mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
}


// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

//Express Session config
app.use(expressSession({
	secret: process.env.ES_SECRET || config.expressSession.secret,
	resave: false,
	saveUninitialized: false
}));

//Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride('_method'));

//Passport Config
app.use(passport.initialize()); // Initialization
app.use(passport.session()); // Persistent sessions
passport.serializeUser(User.serializeUser()); // Encodes data into the session (pasport-local-mongoose)
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//Current User Middleware
app.use((req, res, next) =>{
	res.locals.user = req.user;
	next();
});

//Route Config
app.use(mainRoutes);
app.use(authRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);



//====================
//Listen 
//====================
app.listen(process.env.PORT || 3000, () => {
	console.log("App is running...");
})