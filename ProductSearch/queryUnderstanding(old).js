const OpenAI = require("openai");
const config = require("./config");

const openai = new OpenAI({
	apiKey: config.OPENAI_API_KEY,
});

async function extractEntities(userQuery) {
	const messages = [
		{
			role: "system",
			content: `You are a parsing assistant designed to identify product categories, sub-categories, brands, and prices from a user's search query. Output should be a JSON object containing these details. If you cannot identify any of the four attributes, label it as 'Not Specified'. Example output format: {"category": "Electronics", "sub_category": "Smartphones", "brand": "Apple", "price": "400-600 USD"}.`,
		},
		{
			role: "user",
			content: userQuery,
		},
	];

	const completion = await openai.chat.completions.create({
		messages: messages,
		model: "gpt-3.5-turbo",
		temperature: 0,
	});

	const content = completion.choices[0].message.content;

	try {
		const parsedContent = JSON.parse(content);
		return {
			category: parsedContent.category || null,
			sub_category: parsedContent.sub_category || null,
			brand: parsedContent.brand || null,
			price: parsedContent.price || null,
		};
	} catch (e) {
		console.error("Error in parsing GPT-3 response:", e);
		return null;
	}
}

module.exports = {
	extractEntities,
};
