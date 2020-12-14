const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	title: String,
	author: String,
	description: String,
	genre: String,
	image_link: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	upvotes: [String],
	downvotes: [String]
})

bookSchema.index({
	'$**': 'text'
})

const Book = mongoose.model("book", bookSchema);

module.exports = Book;