const express = require("express");
const router = express.Router();

// Importing your existing modules
const { generateEmbeddings } = require("./embeddings.js");
const queryPineconeForEmbeddings = require("./queryPineconeForEmbeddings.js");
const generateOpenAIResponse = require("./generateOpenAIResponse.js");

// Search API endpoint
router.post("/", async (req, res) => {
	const userQuery = req.body.query;

	// Validate the request body
	if (!userQuery) {
		return res.status(400).json({
			error: "The 'query' field must be provided in the request body.",
		});
	}

	try {
		const queryVector = await generateEmbeddings(userQuery);
		if (!queryVector) {
			throw new Error("Failed to generate query vector.");
		}

		const queryResults = await queryPineconeForEmbeddings(queryVector);
		if (!queryResults) {
			throw new Error("Failed to get query results from Pinecone.");
		}

		const openAIResponse = await generateOpenAIResponse(
			userQuery,
			queryResults
		);
		if (!openAIResponse) {
			throw new Error("Failed to generate response from OpenAI.");
		}

		res.status(200).json(openAIResponse);
	} catch (err) {
		console.error("An error occurred:", err);
		res.status(500).json({
			error: "Internal Server Error",
			message: err.message,
		});
	}
});

module.exports = router;
