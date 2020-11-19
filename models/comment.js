const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	user: {		
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	text: String,
	bookId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book"
	}
})

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;