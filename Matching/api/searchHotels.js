// api/searchFlights.js
const axios = require("axios");

async function searchHotels({ query }) {
	const options = {
		method: "GET",
		url: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination",
		params: { query: query },
		headers: {
			"X-RapidAPI-Key":
				"4402349cc8msha1a5d8ad9eb09a4p171e81jsnc2f61e2652fe",
			"X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
		},
	};

	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error("Error fetching hotel data:", error);
		return null; // or handle the error as needed
	}
}
module.exports = searchHotels;
