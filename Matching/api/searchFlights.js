// api/searchFlights.js
const axios = require("axios");

async function searchFlights({
	location_from,
	location_to,
	departure_date,
	page,
	country_flag,
}) {
	const axios = require("axios");

	const options = {
		method: "GET",
		url: "https://booking-com13.p.rapidapi.com/flights/one-way",
		params: {
			location_from, // The departure location in 'City, Country' format
			location_to, // The arrival location in 'City, Country' format
			departure_date, // The departure date in 'YYYY-MM-DD' format
			page, // The page number for pagination of results, defaulting to '1'
			country_flag, // The country code to tailor the search results and formatting, defaulting to 'us'
		},
		headers: {
			"X-RapidAPI-Key":
				"4402349cc8msha1a5d8ad9eb09a4p171e81jsnc2f61e2652fe",
			"X-RapidAPI-Host": "booking-com13.p.rapidapi.com",
		},
	};

	try {
		const response = await axios.request(options);


        if (response.data.data.flights && Array.isArray(response.data.data.flights)) {
            const flights = response.data.data.flights.map((flight) => ({
                shareableUrl: flight.shareableUrl,
                travelerPrices: flight.travelerPrices,
            }));
        
            console.log(flights);
            return flights;
        } else {
            console.log("No flights data available.");
            return []; // Return an empty array or handle it as needed
        }
		// const flights = response.data.data.flights.map((flight) => ({
		// 	shareableUrl: flight.shareableUrl,
		// 	travelerPrices: flight.travelerPrices,
		// }));

		// console.log(flights);
		// return flights;
	} catch (error) {
		console.error(error);
		return null; // Or handle the error as appropriate
	}
}

module.exports = searchFlights;
