// handleToolCall.js
const searchAmazonRealTimeData = require("./api/searchAmazonRealTimeData");
const getTicketmasterEvents = require("./api/getTicketmasterEvents");

const searchFlights = require("./api/searchFlights");
const searchHotels = require("./api/searchHotels");

async function handleToolCall(toolName, functionArgs) {
	switch (toolName) {
		case "amazonrealtimesearch":
			return await searchAmazonRealTimeData(functionArgs);
		case "eventfinder":
			return await getTicketmasterEvents(functionArgs);
		case "flightSearch":
			return await searchFlights(functionArgs);
		case "hotelSearch":
			return await searchHotels(functionArgs);
		// Add more cases as necessary
		default:
			throw new Error(`No API function matched for tool: ${toolName}`);
	}
}

module.exports = handleToolCall;
