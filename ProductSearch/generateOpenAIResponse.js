const OpenAI = require("openai");
const config = require("./config");

const openai = new OpenAI({
	apiKey: config.OPENAI_API_KEY,
});

function formatQueryResults(queryResults) {
	// Utilizing map to iterate through the queryResults array and construct a new array
	return queryResults.map((result) => {
		// Destructuring the id and metadata fields from each result object
		const { id, metadata } = result;

		// Creating a new object with id and all keys from metadata
		const formattedResult = { id, ...metadata };

		return formattedResult;
	});
}

const generateOpenAIResponse = async (userQuery, queryResults) => {
	try {
		const formattedResults = await formatQueryResults(queryResults);

		const promptBase = `User query: """${userQuery}"""\nResults From Database IDs:\n """${JSON.stringify(
			formattedResults
		)}"""`;

		const messages = [
			{
				role: "system",
				content: `You are serving as a Customer Service JSON Generator Assistant. Your primary responsibility is to dynamically generate a well-structured JSON response based on the user's query and the matching record IDs retrieved from the system.
			  
			  The JSON response should consist of two main fields:
			  1. 'description': This field should encapsulate a concise overview of the query results. It should be informative enough to provide the user with the general context but should not delve into specific details of the individual records found.
			  
			  2. 'results': This field should contain an array of ONLY the 'id' values that match the user's query from the database. It is crucial that ONLY the 'id' values are included to provide a focused response.
			  
			  Special Cases:
			  - If the query yields no matching record IDs from the database, the 'description' field should explicitly indicate this outcome. In such a case, the 'results' field should remain empty.
			  - If there are alternative records that might interest the user, the IDs of these records should be included in the 'results' field, but ONLY IF THEY ARE PRESENT IN THE DATABASE RESULTS.
			  
			  IMPORTANT: MAKE SURE NOT TO INCLUDE ANYTHING EXTRA IN THE RESULTS THAT IS NOT IN THE RESULTS FROM THE DATABASE.
			  Note: The 'description' field should not contain detailed attributes of the records found. Such details are to be exclusively placed in the 'results' field.`,
			},
			{
				role: "user",
				content: promptBase,
			},
		];
		const completion = await openai.chat.completions.create({
			messages: messages,
			model: "gpt-3.5-turbo",
		});

		const responseContent = completion.choices[0].message.content.trim();

		let jsonResponse;
		try {
			jsonResponse = JSON.parse(responseContent);
		} catch (error) {
			console.error(
				"Failed to parse the GPT-3 response into JSON:",
				error
			);
			return null;
		}

		// Filter formattedResults to include only the records that have IDs matching those in jsonResponse.results
		const filteredFormattedResults = formattedResults.filter(
			(formattedResult) => {
				return jsonResponse.results.includes(formattedResult.id);
			}
		);

		// Create the final response object
		const finalResponse = {
			description: jsonResponse.description,
			results: filteredFormattedResults,
		};

		// console.log(finalResponse);

		return finalResponse;
	} catch (error) {
		console.error("An error occurred during the OpenAI query:", error);
		return null;
	}
};

module.exports = generateOpenAIResponse;
