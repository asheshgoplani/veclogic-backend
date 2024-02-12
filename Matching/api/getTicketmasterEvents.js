const axios = require("axios");


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


module.exports = getTicketmasterEvents;
