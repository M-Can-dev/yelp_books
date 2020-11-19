const Book = require("../models/book");
const Comment = require("../models/comment");



const book_seeds = [
	{
	title: "Animal Farm",
	author: "George Orwell",
	description: "A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality. Thus the stage is set for one of the most telling satiric fables ever penned—a razor-edged fairy tale for grown-ups that records the evolution from revolution against tyranny to a totalitarianism just as terrible. ",
	genre: "Fiction",
	image_link: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1424037542l/7613.jpg"
	},
	{
	title: "The Lord of the Rings - The Fellowship of the Ring",
	author: "J.R.R. Tolkien",
	description: "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkeness bind them.In a sleepy village in the Shire, young Frodo Baggins finds himself faced with an immense task, as his elderly cousin Bilbo entrusts the Ring to his care. Frodo must leave his home and make a perilous journey across Middle-earth to the Cracks of Doom, there to destroy the Ring and foil the Dark Lord in his evil purpose.",
	genre: "Fantasy",
	image_link: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1298411339l/34.jpg"
	},
	{
	title: "The Brothers Karamazov",
	author: "Fyodor Dostoyevsky",
	description: "The Brothers Karamazov is a murder mystery, a courtroom drama, and an exploration of erotic rivalry in a series of triangular love affairs involving the “wicked and sentimental” Fyodor Pavlovich Karamazov and his three sons―the impulsive and sensual Dmitri; the coldly rational Ivan; and the healthy, red-cheeked young novice Alyosha. Through the gripping events of their story, Dostoevsky portrays the whole of Russian life, is social and spiritual striving, in what was both the golden age and a tragic turning point in Russian culture.",
	genre: "Fiction",
	image_link: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1427728126l/4934.jpg"
	}
]

const seed = async () => {
	//Delete all the current comics and comments
	await Book.deleteMany();
	console.log("All comics deleted");
	
	await Comment.deleteMany();
	console.log("All comments deleted");
	
	//Create three new comics
	//for (const book_seed of book_seeds) {
	//	let book = await Book.create(book_seed);
	//	console.log("New Book:", book.title)
	//		//Create three new comment
	//	await Comment.create({
	//		text: "I love this book!",
	//		user: "Anan",
	//		bookId: book._id
	//	})
	//	console.log("Comment created!")
	//}

}


module.exports = seed;