const express = require("express");
const router = express.Router();
const config = require("../ProductSearch/config"); // Replace with the actual path to your config file
const { PineconeClient } = require("@pinecone-database/pinecone");
require("dotenv").config();
const { clearMongoDBCollection } = require("../DataIngest/mongo.js"); // Import the function

const PINECONE_API_KEY = config.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = config.PINECONE_ENVIRONMENT;
const INDEX_NAME = config.INDEX_NAME;

async function clearAllEmbeddings() {
	const pinecone = new PineconeClient();
	await pinecone.init({
		environment: PINECONE_ENVIRONMENT,
		apiKey: PINECONE_API_KEY,
	});

	let index = pinecone.Index(INDEX_NAME);
	await index.delete1({
		deleteAll: true,
	});
}

router.post("/", async (req, res) => {
	try {
		await clearAllEmbeddings();
		await clearMongoDBCollection(); // Call the function to clear MongoDB collection

		res.status(200).json({ message: "All embeddings cleared." });
	} catch (err) {
		console.error("Failed to initialize Pinecone:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
