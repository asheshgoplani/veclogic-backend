const express = require("express");
const router = express.Router();
const config = require("../ProductSearch/config"); // Replace with the actual path to your config file
const axios = require("axios");
const OpenAI = require("openai");
const tools = require("./toolsConfig");
const determineToolName = require("./determineToolName"); // Adjust the path as necessary

const { saveChatMessage, getChatHistory } = require("../DataIngest/mongo"); // Adjust the path as necessary

const handleToolCall = require("./handleToolCall");

var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Add this line to handle CORS

const openai = new OpenAI({
	apiKey: config.OPENAI_API_KEY,
});

const MAX_HISTORY_MESSAGES = 10; // Define a default maximum number of messages

// This function fetches the user's chat history and prunes it to the last few messages.
async function fetchAndPruneChatHistory(userId, category, subCategory) {
	try {
		// Fetch the full chat history for the user, category, and subCategory
		const fullChatHistory = await getChatHistory({
			userId,
			category,
			subCategory,
			page: 1, // Assuming pagination is implemented and you want the most recent
			limit: 100, // Fetch more to ensure you have enough data to prune from
		});

		// Prune the chat history to keep only the last MAX_HISTORY_MESSAGES messages
		const prunedChatHistory = fullChatHistory.slice(-MAX_HISTORY_MESSAGES);

		// Transform the pruned chat history to the expected format, if necessary
		const formattedHistory = prunedChatHistory.map((msg) => {
			// You might need to adjust the object structure based on your actual chat message schema
			return {
				role: msg.senderType.toLowerCase(), // Assuming 'senderType' is either 'USER' or 'SYSTEM'
				content: msg.message,
			};
		});

		return formattedHistory;
	} catch (error) {
		console.error("Error fetching and pruning chat history:", error);
		return []; // Return an empty array in case of an error to avoid breaking the chat flow
	}
}

router.post("/", async (req, res) => {
	{
		const { userId, category, subCategory, message } = req.body;

		// Ensure that userId is provided
		if (!userId) {
			return res.status(400).send("userId is required");
		}

		const previousChatHistory = await fetchAndPruneChatHistory(
			userId,
			category,
			subCategory
		);
		// Convert previous chat history to the format expected by OpenAI, if necessary
		// const formattedHistory = previousChatHistory.map(msg => {
		// 	return { role: msg.senderType.toLowerCase(), content: msg.message };
		// });
		const userMessageData = {
			userId: userId,
			category: category,
			subCategory: subCategory,
			createdAt: new Date().toISOString(),
			senderType: "USER",
			message: message,
		};

		await saveChatMessage(userMessageData);

		let conversation = [];
		conversation.push({
			role: "system",
			content: `Assume the role of a "Chatahoot customer service agent." In this capacity, your responses to user queries should adhere to the following guidelines:
			
			1. **Personalization:** Always introduce yourself as a "Chatahoot customer service agent" to establish your role and set the tone for the interaction.
			
			2. **Clarity and Structure:** Present information in a structured, easy-to-understand manner. Organize your responses logically, ensuring that they directly address the user's query.
			
			3. **Functionality Use:** Only invoke specific functions if the required information is not already present in the conversation history. This ensures that the interaction remains efficient and relevant.
			
			4. **Reviewing History:** Consider the user's conversation history to provide contextually relevant responses. This involves recognizing previous queries and building upon past interactions to offer a cohesive experience.
			
			5. **Conversational Tone:** Adopt a conversational and helpful tone throughout the interaction. Use phrases like "Sure, let me try and help you with that" to convey a sense of assistance and support.
			
			6. **Guidance and Assistance:** Act as a helpful assistant, guiding users through their inquiries with informative and supportive responses. Your goal is to resolve their queries effectively, enhancing their overall experience with Chatahoot.
			
			Your responses should embody these principles, ensuring that each interaction is personalized, informative, and engaging. This approach will foster a positive user experience, reinforcing Chatahoot's commitment to exceptional customer service.`,
		});
		conversation.push({ role: "user", content: message });

		// let toolName = "auto"; // Default to auto

		let toolName = determineToolName(category, subCategory);

		conversation.push({
			role: "user",
			content: `Use the tool ${toolName}`,
		});

		try {
			const response = await openai.chat.completions.create({
				model: "gpt-4",
				messages: conversation,
				tools: tools,
				tool_choice: "auto",
			});

			const responseMessage = response.choices[0].message;
			conversation.push(responseMessage); // Add AI's first response to the conversation

			if (responseMessage.tool_calls) {
				for (const toolCall of responseMessage.tool_calls) {
					const functionArgs = JSON.parse(
						toolCall.function.arguments
					);
					// try {
					const toolResponse = await handleToolCall(
						toolCall.function.name,
						functionArgs
					);
					const toolResponseMessage = {
						tool_call_id: toolCall.id,
						role: "tool",
						name: toolCall.function.name,
						content: JSON.stringify(toolResponse),
					};
					conversation.push(toolResponseMessage);
				}

				conversation.push({
					role: "user",
					content: `Your matching response should be in HTML format directly. without any further explanation about the HTML.THERE WOULD BE EXPLANATION OF THE MATCH IN A P TAG. it should be in HTML tags along with the links in proper tags aswell. DONOT add explanation of the HTML SUCH AS DONOT SAY HERE IS THE HTML OF IT. BUT DO INCLUDE THE CONVERSATION OF THE MATCHED THINGS. Also in your repsonse donot say anything like "I understand that you're looking for an HTML format directly, here it is: ". Instead you could add you helpful assistance conversation in the html itself.`,
				});

				conversation.push({
					role: "user",
					content: `Construct the response entirely in HTML, focusing on delivering the required information and links within a structured and accessible HTML framework. Specifically:
					
					1. Directly embed any explanations or details related to the user's query within <p> tags, ensuring the text is clear and informative.
					2. Incorporate all links relevant to the user's request within <a href=""> tags, accurately pointing to the intended destinations.
					3. Avoid any form of meta-description about using HTML or its elements. This means you should not introduce the response with phrases like "Here is the HTML" or any similar statements.
					4. Any interactive or conversational elements that aid in providing assistance should be seamlessly integrated within the HTML content, without explicitly stating their presence or format.
					5. The response must maintain a consistent structure that anticipates immediate use, without requiring further modification or explanation from the user's end.
					
					The aim is to ensure that the response is not only formatted correctly in HTML but also remains strictly focused on addressing the user's needs with precision and clarity. This approach facilitates direct actionability and enhances the user experience by providing all necessary information and options within a well-organized HTML response.`,
				});
				// Second OpenAI call with the updated conversation history, including tool responses
				const secondResponse = await openai.chat.completions.create({
					model: "gpt-4",
					messages: conversation,
				});

				let finalMessage = secondResponse.choices[0].message.content;

				// Construct the response object with optional fields

				// Construct the response object with optional fields
				let responseObj = {
					userId: userId, // Include the userId in the response object
					category: category,
					subCategory: subCategory,
					createdAt: new Date().toISOString(),
					senderType: "BOT",
					message: finalMessage,
				};

				// Save the chat message to MongoDB
				await saveChatMessage(responseObj); // Assuming saveChatMessage is imported from mongo.js

				// Wrap the response in the new format
				res.json({
					success: true,
					message: "",
					data: responseObj,
				});

				// res.json(responseObj);
			} else {
				// Handle case where no tool call was made
				// res.json({ reply: responseMessage.content });
				let responseObj = {
					userId: userId, // Include the userId in the response object
					category: category,
					subCategory: subCategory,
					createdAt: new Date().toISOString(),
					senderType: "BOT",
					message: responseMessage.content,
				};

				// Save the chat message to MongoDB
				await saveChatMessage(responseObj);

				res.json({
					success: true,
					message: "",
					data: responseObj,
				});
			}
		} catch (error) {
			console.error("Error in conversation:", error);
			res.status(500).json({
				// Use JSON response
				success: false,
				message: "An error occurred while processing your request.",
			});
		}
	}
});

module.exports = router;
