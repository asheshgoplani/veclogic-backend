// toolsConfig.js
const toolsConfig = [
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
			name: "amazonrealtimesearch",
			description: "Search for products on Amazon Real-Time Data API",
			parameters: {
				type: "object",
				properties: {
					query: {
						type: "string",
						description: "Query for Amazon search",
					},
					page: {
						type: "string",
						description: "Page number",
					},
					country: {
						type: "string",
						description: "Country code",
					},
					categoryId: {
						type: "string",
						description: "Category ID",
					},
				},
				required: ["query"],
			},
		},
	},

	{
		type: "function",
		function: {
			name: "bookingdestinationsearch",
			description: "Search for destinations on Booking.com",
			parameters: {
				type: "object",
				properties: {
					query: {
						type: "string",
						description: "Query for destination search",
					},
				},
				required: ["query"],
			},
		},
	},

	// {
	//     type: "function",
	//     function: {
	//         name: "flightSearch", // This should match the tool name used in determineToolName
	//         description: "Search for flights using the specified criteria",
	//         parameters: {
	//             type: "object",
	//             properties: {
	//                 fromId: {
	//                     type: "string",
	//                     description: "The ID of the departure airport",
	//                 },
	//                 toId: {
	//                     type: "string",
	//                     description: "The ID of the destination airport",
	//                 },
	//                 departDate: {
	//                     type: "string",
	//                     description: "The departure date in YYYY-MM-DD format",
	//                 },
	//                 pageNo: {
	//                     type: "string",
	//                     description: "The page number for pagination",
	//                 },
	//                 adults: {
	//                     type: "string",
	//                     description: "The number of adults",
	//                 },
	//                 children: {
	//                     type: "string",
	//                     description: "The ages of the children, comma-separated",
	//                 },
	//                 currency_code: {
	//                     type: "string",
	//                     description: "The currency code for pricing",
	//                 },
	//             },
	//             required: ["fromId", "toId", "departDate", "adults"], // Mark required fields as necessary
	//         },
	//     },
	// },
	// {
	// 	type: "function",
	// 	function: {
	// 		name: "flightSearch",
	// 		description:
	// 			"Search for one-way flights using the RapidAPI Booking.com API",
	// 		parameters: {
	// 			type: "object",
	// 			properties: {
	// 				location_from: {
	// 					type: "string",
	// 					description:
	// 						"The departure location in 'City, Country' format",
	// 				},
	// 				location_to: {
	// 					type: "string",
	// 					description:
	// 						"The arrival location in 'City, Country' format",
	// 				},
	// 				departure_date: {
	// 					type: "string",
	// 					description:
	// 						"The departure date in 'YYYY-MM-DD' format",
	// 				},
	// 				page: {
	// 					type: "string",
	// 					description:
	// 						"The page number for pagination of results",
	// 				},
	// 				country_flag: {
	// 					type: "string",
	// 					description:
	// 						"The country code to tailor the search results and formatting",
	// 				},
	// 			},
	// 			required: ["location_from", "location_to", "departure_date"],
	// 		},
	// 	},
	// },

	{
		type: "function",
		function: {
			name: "flightSearch",
			description:
				"Search for one-way flights using the RapidAPI Booking.com API",
			parameters: {
				type: "object",
				properties: {
					location_from: {
						type: "string",
						description:
							"The departure location in 'City, Country' format",
					},
					location_to: {
						type: "string",
						description:
							"The arrival location in 'City, Country' format",
					},
					departure_date: {
						type: "string",
						description:
							"The departure date in 'YYYY-MM-DD' format",
					},
					page: {
						type: "string",
						description:
							"The page number for pagination of results",
					},
					country_flag: {
						type: "string",
						description:
							"The country code to tailor the search results and formatting",
					},
				},
				required: ["location_from", "location_to", "departure_date"],
			},
		},
	},

	// {
	// 	type: "function",
	// 	function: {
	// 		name: "flightSearch",
	// 		description: "Search for flight information using a specified API",
	// 		parameters: {
	// 			type: "object",
	// 			properties: {
	// 				fromId: {
	// 					type: "string",
	// 					description: "The departure airport ID",
	// 				},
	// 				toId: {
	// 					type: "string",
	// 					description: "The arrival airport ID",
	// 				},
	// 				departDate: {
	// 					type: "string",
	// 					description:
	// 						"The departure date in 'YYYY-MM-DD' format",
	// 				},
	// 				pageNo: {
	// 					type: "integer",
	// 					description:
	// 						"The page number for pagination of results, defaulting to '1'",
	// 				},
	// 				adults: {
	// 					type: "integer",
	// 					description: "Number of adults",
	// 				},
	// 				children: {
	// 					type: "string",
	// 					description:
	// 						"Children ages in a comma-separated string, e.g., '0,17'",
	// 				},
	// 				currency_code: {
	// 					type: "string",
	// 					description:
	// 						"Currency code for the pricing, e.g., 'AED'",
	// 				},
	// 			},
	// 			required: ["fromId", "toId", "departDate"],
	// 		},
	// 	},
	// },

	{
		type: "function",
		function: {
			name: "hotelSearch", // Ensure this matches the string returned by determineToolName for hotel searches
			description: "Search for hotels using the specified criteria",
			parameters: {
				type: "object",
				properties: {
					query: {
						type: "string",
						description: "Query for hotel search",
					},
				},
				required: ["query"], // Mark required fields as necessary
			},
		},
	},
];

module.exports = toolsConfig;
