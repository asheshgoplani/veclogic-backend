const { PineconeClient } = require("@pinecone-database/pinecone");
const config = require("./config");

async function queryPineconeWithEmbeddings(queryEmbeddings, queryFilter) {
	try {
		const pinecone = new PineconeClient();

		// Initialize Pinecone
		await pinecone.init({
			environment: config.PINECONE_ENVIRONMENT,
			apiKey: config.PINECONE_API_KEY,
		});

		const index = pinecone.Index(config.INDEX_NAME);

		// Execute Query
		const queryResponse = await index.query({
			queryRequest: {
				topK: 5, // Get top 5 results
				vector: queryEmbeddings,
				includeValues: true,
				includeMetadata: true,
			},
		});

		// Calculate a match score based on metadata and filter criteria
		const scoredResults = queryResponse.matches.map((result) => {
			const metadata = result.metadata;
			let matchScore = 0;

			if (
				queryFilter.category &&
				metadata.category === queryFilter.category
			)
				matchScore++;
			if (
				queryFilter.sub_category &&
				metadata.sub_category === queryFilter.sub_category
			)
				matchScore++;
			if (queryFilter.brand && metadata.brand === queryFilter.brand)
				matchScore++;
			if (queryFilter.price && metadata.price === queryFilter.price)
				matchScore++;

			// Calculate the composite score
			const pineconeScore = result.score; // Pinecone similarity score
			const compositeScore = pineconeScore * 0.7 + matchScore * 0.3; // weighted sum

			return { ...result, matchScore, compositeScore };
		});

		// Sort by composite score and return sorted results
		const sortedResults = scoredResults.sort(
			(a, b) => b.compositeScore - a.compositeScore
		);

		return sortedResults;
	} catch (error) {
		console.error("An error occurred during the Pinecone query:", error);
		return null; // or throw error, based on how you want to handle it upstream
	}
}

module.exports = queryPineconeWithEmbeddings;
