require("dotenv").config();

const config = {
	PINECONE_API_KEY: process.env.PINECONE_API_KEY,
	PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
	INDEX_NAME: process.env.INDEX_NAME,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	OPENAI_ENDPOINT: "https://api.openai.com/v1/embeddings",
	MODEL_NAME: "text-embedding-ada-002",
};

module.exports = config;
