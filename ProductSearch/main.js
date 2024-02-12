const { generateEmbeddings } = require("./embeddings.js");
const queryPineconeForEmbeddings = require("./queryPineconeForEmbeddings");
const generateOpenAIResponse = require("./generateOpenAIResponse");

const userQuery = "Can you recommend a powerful vacuum cleaner";

(async () => {
	const queryVector = await generateEmbeddings(userQuery);

	const queryResults = await queryPineconeForEmbeddings(queryVector);

	const openAIResponse = await generateOpenAIResponse(
		userQuery,
		queryResults
	);
	console.log("OpenAI Response:", openAIResponse);
})();
