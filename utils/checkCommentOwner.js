const Comment = require("../models/comment");

const checkCommentOwner = async (req, res, next) => {
	if(req.isAuthenticated()) {
		const comment = await Comment.findById(req.params.commentId).exec();
		if(comment.user.id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that!");
			res.redirect("back");
		}
	} else {
		req.flash("error", "You must be logged in to do that!");
		res.redirect("/login");
	}
}

module.exports = checkCommentOwner;