const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Comment = require("../models/comment");
const isLoggedIn = require("../utils/isLoggedIn");
const checkBookOwner = require("../utils/checkBookOwner");


// Books Page
router.get("/", async (req, res) => {
	console.log(req.user);
	try {
		const books = await Book.find().exec();
		res.render("books", {books});
	} catch (err) {
		console.log(err);
		res.send("Error... /index");
	}
})


router.get("/new", isLoggedIn, (req, res) => {
	res.render("books_new");
})


// Create Book
router.post("/", isLoggedIn, async (req, res) => {
	const genre = req.body.genre.toLowerCase();
	const newBook = {
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		genre,
		image_link: req.body.image_link,
		owner: {
			id: req.user._id,
			username: req.user.username
		},
		upvotes: [req.user.username],
		downvotes: []
	}
	
	try {
		const book = await Book.create(newBook);
		req.flash("success", `Succesfully added ${newBook.title}`)
		console.log(book);
		res.redirect("/books/" + book._id);
		
	} catch(err) {
		req.flash("error", "Error creating book");
		res.redirect("/books");
	}
})	

//Search
router.get("/search", async (req, res) => {
	try {
		const books = await Book.find({
			$text: {
				$search: req.query.term
			}
		});
		
		res.render("books", {books});
	} catch (err) {
		console.log(err);
		res.send("Error...searching");
	}
})

//Genre
router.get("/genre/:genre", async (req, res) => {
	//Check if the given genre is valid
	const validGenres = ["fiction", "fantasy", "history", "mystery", "science-fiction", "biography", "crime", "educational"];
	if (validGenres.includes(req.params.genre.toLowerCase())) {
		//If yes continue
		const books = await Book.find({genre: req.params.genre}).exec();
		res.render("books", {books});
	} else {
		//If no, send error
		res.send("Please enter a valid genre")
	}	
})

//Vote
router.post("/vote", isLoggedIn, async (req, res) => {
	console.log("Request body", req.body)
	
	
	
	const book = await Book.findById(req.body.bookId)
	const alreadyUpvoted = book.upvotes.indexOf(req.user.username) // will be -1 if not found
	const alreadyDownvoted = book.downvotes.indexOf(req.user.username) // will be -1 if not found
	
	let response = {}
	//Voting logic
	if(alreadyUpvoted === -1 && alreadyDownvoted === -1) { // If user did not voted
		if( req.body.voteType === "up") { // Upvoted
			book.upvotes.push(req.user.username);
			book.save()
			response = {message: "Upvote tallied", code: 1};
		} else if (req.body.voteType === "down") {
			book.downvotes.push(req.user.username);
			book.save()
			response = {message: "Downvote tallied!", code: -1}
		} else { // Error
			response = {message: "Error 1", code: "err"}
		}
	} else if (alreadyUpvoted >= 0) { //If user upvote
		if (req.body.voteType === "up" ) {
			book.upvotes.splice(alreadyUpvoted, 1);
			book.save();
			response = {message: "Upvote removed", code: 0};
		} else if (req.body.voteType === "down") {
			book.upvotes.splice(alreadyUpvoted, 1);
			book.downvotes.push(req.user.username);
			book.save();
			response = {message: "Changed to downvote", code: -1} 
		} else {
			response = {message: "Error 2", code: "err"};
		}
		
	} else if (alreadyDownvoted >= 0 ) { // If user downvoted
		if (req.body.voteType === "up") {
			book.downvotes.splice(alreadyDownvoted, 1);
			book.upvotes.push(req.user.username);
			book.save();
			response = {message:"Changed to upvote", code: 1} ;
		} else if (req.body.voteType === "down" ) {
			book.downvotes.splice(alreadyDownvoted, 1);
			book.save();
			response =  {message: "Downvote removed", code: 0};
		} else {
			response = {message: "Error 3", code: "err"} ;
		}
		
	} else { // Error
		response = {message: "Error 4", code:"err"}; 
	}
	
	//Update score
	response.score = book.upvotes.length - book.downvotes.length;
	
	res.json(response);
});

// Show Book
router.get("/:id", async (req, res) => {	
	try {
		const book = await Book.findById(req.params.id).exec();
		const comments = await Comment.find({bookId: req.params.id});
		res.render("books_show", {book, comments})
	} catch(err) {
		console.log(err);
		res.send()
	}

	
})


// Edit Book
router.get("/:id/edit", checkBookOwner,  async (req, res) => {
	
		const book = await Book.findById(req.params.id).exec();
		res.render("books_edit", {book});
})

// Update Book
router.put("/:id", checkBookOwner, async (req, res) =>{
	const genre = req.body.genre.toLowerCase();
	const book = {
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		genre,
		image_link: req.body.image_link
	}
	try{
		const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {new: true}).exec();
		req.flash("success", `${book.title} updated`);
		console.log(updatedBook);
		res.redirect(`/books/${req.params.id}`);
	} catch (err) {
		console.log(err);
		req.flash("error", "Error updating book");
		res.redirect("/:id");
	}
})

// Delete Book

router.delete("/:id", checkBookOwner, async (req, res) =>{
	try{
		const deletedBook = await Book.findByIdAndDelete(req.params.id).exec();
		req.flash("error", "Book deleted.")
		console.log("Deleted: ", deletedBook)
		res.redirect("/books")	
	} catch(err) {
		console.log(err);
		req.flash("error", "Error deleting book");
		res.redirect("/books");
	}

})



module.exports = router;