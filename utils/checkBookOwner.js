const Book = require("../models/book");


const checkBookOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {
		const book = await Book.findById(req.params.id).exec();
		//If owner, render edit form
		if (book.owner.id.equals(req.user._id)) {
			next();
		} else { //If not redirect to books page
			res.redirect("back");
		}
	} else { //If not, redirect 
		res.redirect("/login")
	}
}

module.exports = checkBookOwner; 