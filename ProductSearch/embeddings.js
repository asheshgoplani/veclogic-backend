const axios = require("axios");
const config = require("./config");

async function generateEmbeddings(text) {
	const response = await axios.post(
		config.OPENAI_ENDPOINT,
		{
			input: text,
			model: config.MODEL_NAME,
		},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${config.OPENAI_API_KEY}`,
			},
		}
	);
	return response.data.data[0].embedding;
}

module.exports = {
	generateEmbeddings,
};
