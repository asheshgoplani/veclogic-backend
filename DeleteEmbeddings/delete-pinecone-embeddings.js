const config = require("../ProductSearch/config"); // Replace with the actual path to your config file

const { PineconeClient } = require("@pinecone-database/pinecone");
require("dotenv").config();
const pinecone = new PineconeClient();
const PINECONE_API_KEY = config.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = config.PINECONE_ENVIRONMENT;
const INDEX_NAME = config.INDEX_NAME;
async function initializePinecone() {
	await pinecone.init({
		environment: PINECONE_ENVIRONMENT,
		apiKey: PINECONE_API_KEY,
	});

	let index = pinecone.Index(INDEX_NAME);
	await index.delete1({
		deleteAll: true,
	});
	console.log("All vectors have been deleted.");
}

initializePinecone().catch((error) => {
	console.error("Failed to initialize Pinecone:", error);
});
