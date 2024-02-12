const { PineconeClient } = require("@pinecone-database/pinecone");
const config = require("./config");

async function queryPineconeForEmbeddings(queryEmbeddings) {
	try {
		const pinecone = new PineconeClient();
		await pinecone.init({
			environment: config.PINECONE_ENVIRONMENT,
			apiKey: config.PINECONE_API_KEY,
		});

		const index = pinecone.Index(config.INDEX_NAME);

		const queryResponse = await index.query({
			queryRequest: {
				topK: 15, // Get top 5 results
				vector: queryEmbeddings,
				includeValues: false,
				includeMetadata: true,
			},
		});

		return queryResponse.matches;
	} catch (error) {
		console.error("An error occurred during the Pinecone query:", error);
		return null; // or throw error, based on how you want to handle it upstream
	}
}

module.exports = queryPineconeForEmbeddings;
