const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const Book = require("../models/book");
const isLoggedIn = require("../utils/isLoggedIn");
const checkCommentOwner = require("../utils/checkCommentOwner");

router.get("/new", isLoggedIn, (req, res) => {
	res.render("comments_new", {bookId: req.params.id})
})

router.post("/", isLoggedIn, (req, res) =>{
	const newComment = {
		user: {
			id: req.user._id,
			username: req.user.username
		},
		text: req.body.text,
		bookId: req.body.bookId,
		
	}

	Comment.create(newComment)
	.then((comment) =>{
		req.flash("success", "Comment created!");
		res.redirect(`/books/${req.body.bookId}`)
	}) 
	
	.catch((err) =>{
		req.flash("error", "Error creating comment. Please try again.");
		res.redirect(`/books/${req.body.bookId}`)
	})
})


router.get("/:commentId/edit", checkCommentOwner, async (req, res) =>{
	try {
		const book = await Book.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		res.render("comments_edit", {book, comment});
	} catch (err) {
		console.log(err);
		res.redirect(`/books/${req.body.bookId}`)
	}
		

})

router.put("/:commentId", checkCommentOwner,  async (req, res) => {
	try {
		const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true}).exec();
		req.flash("success", "Comment edited!");
		console.log(updatedComment);
		res.redirect(`/books/${req.params.id}`);
	} catch(err) {
		console.log(err);
		req.flash("error", "Error editing comment. Please try again.")
		res.redirect("/books");
	}
})

router.delete("/:commentId", checkCommentOwner, async (req, res) => {
	try {
		const deletedComment = await Comment.findByIdAndDelete(req.params.commentId).exec();
		console.log(deletedComment);
		req.flash("success", "Comment deleted.");
		res.redirect(`/books/${req.params.id}`);
	} catch(err) {
		console.log(err);
		req.flash("error", "Error deleting comment");
		res.redirect("/books");
	}
})



module.exports = router;