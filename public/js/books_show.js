// ===================================
// Select element
//====================================

const upvoteBtn = document.getElementById("upvote-btn");
const downvoteBtn = document.getElementById("downvote-btn");

// ===================================
// Add EventListeners
//====================================
upvoteBtn.addEventListener("click", async function() {
	//Build Fetch options
	const options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({vote: "up"})
			
		
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
})