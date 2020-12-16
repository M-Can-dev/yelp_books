// ===================================
// Select element
//====================================

const upvoteBtn = document.getElementById("upvote-btn");
const downvoteBtn = document.getElementById("downvote-btn");


// ===================================
// Helper Function
//====================================
const sendVote = async (voteType) => {
	const options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		}	
	} 
	if (voteType === "up") {
		options.body = JSON.stringify({
			voteType: "up",
			bookId
		});
	} else if (voteType === "down") {
		options.body = JSON.stringify({
			vote: "down",
			bookId
		});
	} else {
		throw "voteType must be 'up' or ' down' "
	}
	//Send Fetch request
	await fetch("/books/vote", options)
	.then(data => {
		return data.json()
	})
	.then( res => {
		console.log(res)
	})
	.catch (err => {
		console.log(err)
	})
}


// ===================================
// Add EventListeners
//====================================
upvoteBtn.addEventListener("click", async function() {
	sendVote("up")
});

downvoteBtn.addEventListener("click", async function() {
	sendVote("down")
})