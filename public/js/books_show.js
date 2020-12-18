// ===================================
// Select element
//====================================

const upvoteBtn = document.getElementById("upvote-btn");
const downvoteBtn = document.getElementById("downvote-btn");
const score = document.getElementById("score");


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
			voteType: "down",
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
		handleVote(res.score, res.code)
	})
	.catch (err => {
		console.log(err)
	})
}


const handleVote = (newScore, code) => {
	// Update score
	score.innerText = newScore
	//Update vote colors
	if (code === 0) {
		upvoteBtn.classList.remove("btn-success");
		upvoteBtn.classList.add("btn-outline-success");
		downvoteBtn.classList.remove("btn-danger");
		downvoteBtn.classList.add("btn-outline-danger");	
	} else if (code === 1) {
		upvoteBtn.classList.remove("btn-outline-success");
		upvoteBtn.classList.add("btn-success");
		downvoteBtn.classList.remove("btn-danger");
		downvoteBtn.classList.add("btn-outline-danger");
	} else if (code === -1) {
		upvoteBtn.classList.remove("btn-success");
		upvoteBtn.classList.add("btn-outline-success");
		downvoteBtn.classList.remove("btn-outline-danger");
		downvoteBtn.classList.add("btn-danger");
	} else {
		console.log("Error handling the vote");
	}
	
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