const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");
const config = require("./ProductSearch/config");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Add this line to handle CORS

const openai = new OpenAI({
	apiKey: config.OPENAI_API_KEY,
});

async function getTicketmasterEvents({
	keyword,
	location,
	startDateTime,
	endDateTime,
	classificationName,
	countryCode,
	stateCode,
	geoPoint,
	preferredCountry,
	includeSpellcheck,
	domain,
	size = 1,
}) {
	const apiKey = "wUNPPLld2zrUNeXb9r3hDWLcoLoSZMOc"; // Replace with your Ticketmaster API key
	const url = "https://app.ticketmaster.com/discovery/v2/events.json";
	const MAX_EVENTS = 10; // Limit to a maximum of 10 events
	const params = { apikey: apiKey, size: MAX_EVENTS };

	// Add other parameters to the request
	if (keyword) params.keyword = keyword;
	if (location) params.city = location;
	if (startDateTime) params.startDateTime = startDateTime;
	if (endDateTime) params.endDateTime = endDateTime;
	if (classificationName) params.classificationName = classificationName;
	if (countryCode) params.countryCode = countryCode;
	if (stateCode) params.stateCode = stateCode;
	if (geoPoint) params.geoPoint = geoPoint;
	if (preferredCountry) params.preferredCountry = preferredCountry;
	if (includeSpellcheck) params.includeSpellcheck = includeSpellcheck;
	if (domain) params.domain = domain;

	try {
		const response = await axios.get(url, { params });
		if (response.data._embedded && response.data._embedded.events) {
			// Process and return only the first 10 events
			return response.data._embedded.events
				.slice(0, MAX_EVENTS)
				.map((event) => ({
					name: event.name,
					date: event.dates.start.localDate,
					url: event.url,
					pleaseNote: event.pleaseNote,
					info: event.info,
				}));
		} else {
			// Handle cases where events are not present
			return [];
		}
		console.log(response);
		return response.data?._embedded?.events ?? [];
	} catch (error) {
		console.error("Error fetching from Ticketmaster API:", error);
		return null;
	}
}

async function searchAmazonClothing({ keywords, category }) {
	const amazonApiKey = "AKIAIF6665YLFRMYSSLA"; // Replace with your Amazon API key
	const amazonApiUrl = "AMAZON_API_ENDPOINT"; // Replace with the Amazon API endpoint

	const params = {
		keywords: keywords,
		category: category, // Assuming 'category' is a valid parameter for the Amazon API
		// Add other parameters as required by the Amazon API
	};

	try {
		const response = await axios.get(amazonApiUrl, {
			headers: { Authorization: `Bearer ${amazonApiKey}` },
			params,
		});
		// Format the response according to the Amazon API response structure
		return response.data;
	} catch (error) {
		console.error("Error fetching from Amazon API:", error);
		return null;
	}
}

async function searchIMDBMovies({ query }) {
	const imdbApiKey = "7a599d4704msh4ecabca6a4fac4fp136152jsndfb64ea473da"; // Replace with your IMDb API key
	const imdbApiUrl = "https://imdb8.p.rapidapi.com/auto-complete";

	try {
		const response = await axios.get(imdbApiUrl, {
			params: { q: query },
			headers: {
				"X-RapidAPI-Key": imdbApiKey,
				"X-RapidAPI-Host": "imdb8.p.rapidapi.com",
			},
		});
		// Format the response according to the IMDb API response structure
		return response.data.d;
	} catch (error) {
		console.error("Error fetching from IMDb API:", error);
		return null;
	}
}

app.post("/find-events", async (req, res) => {
	// const userMessage = req.body.message;

	const { message, conversationHistory, category } = req.body;
	let conversation = conversationHistory;
	conversation.push({
		role: "system",
		content:
			"You are a customer service agent providing information about the user query. According to users questions. In your response to the user present everything in a structured way so its easier for the user to understand. Only use the function if no information is already there. ALong with the function resposne also look at the conversation history for the users query please.",
	});
	conversation.push({ role: "user", content: message });

	let toolName = "auto"; // Default to auto
	if (category === "tickets") {
		toolName = "eventfinder";
	} else if (category === "clothing") {
		toolName = "clothingsearch";
	} else if (category === "movies") {
		toolName = "imdbsearch";
	}
	// let conversation = [{ role: "user", content: userMessage }];
	// let messages = [{ role: "user", content: userMessage }];

	const tools = [
		{
			type: "function",
			function: {
				name: "eventfinder",
				description: "Find events using the Ticketmaster API",
				parameters: {
					type: "object",
					properties: {
						keyword: {
							type: "string",
							description: "Keyword for events",
						},
						location: {
							type: "string",
							description: "Location for events",
						},
						startDateTime: {
							type: "string",
							description: "Start date and time for events",
						},
						endDateTime: {
							type: "string",
							description: "End date and time for events",
						},
						classificationName: {
							type: "string",
							description: "Classification name for events",
						},
						countryCode: {
							type: "string",
							description: "Country code for events",
						},
						stateCode: {
							type: "string",
							description: "State code for events",
						},
						geoPoint: {
							type: "string",
							description: "Geohash for events",
						},
						preferredCountry: {
							type: "string",
							description: "Preferred country for events",
						},
						includeSpellcheck: {
							type: "string",
							description:
								"Include spellcheck suggestions in the response",
						},
						domain: {
							type: "string",
							description: "Domain for events",
						},
						size: {
							type: "integer",
							description: "Page size of the response",
						},
					},
					// You can adjust the 'required' array as per your requirements
					required: ["keyword"],
				},
			},
		},

		{
			type: "function",
			function: {
				name: "clothingsearch",
				description: "Search for clothing on Amazon",
				parameters: {
					type: "object",
					properties: {
						keywords: {
							type: "string",
							description: "Keywords to search for clothing",
						},
						// Add other parameters as required by the Amazon API
					},
					required: ["keywords"],
				},
			},
		},

		{
			type: "function",
			function: {
				name: "imdbsearch",
				description: "Search for movies on IMDb",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "Query to search for movies",
						},
					},
					required: ["query"],
				},
			},
		},
	];

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo-1106",
			messages: conversation,
			tools: tools,
			tool_choice: "auto",
		});

		const responseMessage = response.choices[0].message;
		conversation.push(responseMessage); // Add AI's first response to the conversation

		if (responseMessage.tool_calls) {
			for (const toolCall of responseMessage.tool_calls) {
				if (toolCall.function.name === "eventfinder") {
					const functionArgs = JSON.parse(
						toolCall.function.arguments
					);
					const eventsResponse = await getTicketmasterEvents(
						functionArgs
					);

					// Create the response message for this tool call
					const toolResponseMessage = {
						tool_call_id: toolCall.id,
						role: "tool",
						name: "eventfinder",
						content: JSON.stringify(eventsResponse), // Format this as per the expected response structure
					};

					// Add the tool response message to the conversation history
					conversation.push(toolResponseMessage);

					// conversation.push({
					// 	role: "assistant",
					// 	content: JSON.stringify(eventsResponse),
					// });
				} else if (toolCall.function.name === "clothingsearch") {
					const functionArgs = JSON.parse(
						toolCall.function.arguments
					);
					const clothingResponse = await searchAmazonClothing(
						functionArgs
					);

					const toolResponseMessage = {
						tool_call_id: toolCall.id,
						role: "tool",
						name: "clothingsearch",
						content: JSON.stringify(clothingResponse), // Format as per expected response
					};

					conversation.push(toolResponseMessage);
				} else if (toolCall.function.name === "imdbsearch") {
					const functionArgs = JSON.parse(
						toolCall.function.arguments
					);
					const moviesResponse = await searchIMDBMovies(functionArgs);

					const toolResponseMessage = {
						tool_call_id: toolCall.id,
						role: "tool",
						name: "imdbsearch",
						content: JSON.stringify(moviesResponse),
					};

					conversation.push(toolResponseMessage);
				}
			}

			// Second OpenAI call with the updated conversation history, including tool responses
			const secondResponse = await openai.chat.completions.create({
				model: "gpt-3.5-turbo-1106",
				messages: conversation,
			});

			let finalMessage = secondResponse.choices[0].message.content;
			res.json({ reply: finalMessage });
		} else {
			// Handle case where no tool call was made
			res.json({ reply: responseMessage.content });
		}
	} catch (error) {
		console.error("Error in conversation:", error);
		res.status(500).send(
			"An error occurred while processing your request."
		);
	}
});

const port = 3001;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
