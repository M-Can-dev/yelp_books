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
		}
	}
	
	try {
		const book = await Book.create(newBook);
		console.log(book);
		res.redirect("/books/" + book._id);
	} catch(err) {
		console.log(err);
		res.send("Error... posting");
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
		console.log(updatedBook);
		res.redirect(`/books/${req.params.id}`);
	} catch (err) {
		console.log(err);
		res.send("Error...updating");
	}
})

// Delete Book

router.delete("/:id", checkBookOwner, async (req, res) =>{
	try{
		const deletedBook = await Book.findByIdAndDelete(req.params.id).exec();
		console.log("Deleted: ", deletedBook)
		res.redirect("/books")	
	} catch(err) {
		console.log(err);
		res.send("Error...deleting");
	}

})



module.exports = router;