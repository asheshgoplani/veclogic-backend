const axios = require("axios");


async function searchAmazonRealTimeData({ query, page, country, categoryId }) {
	const options = {
		method: "GET",
		url: "https://real-time-amazon-data.p.rapidapi.com/search",
		params: {
			query: query,
			page: page,
			country: "GB",
			category_id: categoryId,
		},
		headers: {
			"X-RapidAPI-Key":
				"ec1abb7c86msh7a2ab24f4922cf7p1e9f10jsn7a2c27f7886e",
			"X-RapidAPI-Host": 'real-time-amazon-data.p.rapidapi.com',
		},
	};

	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error("Error fetching from Amazon Real-Time Data API:", error);
		return null;
	}
}

module.exports = searchAmazonRealTimeData;
