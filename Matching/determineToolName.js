function determineToolName(category, subCategory) {
	switch (category) {
		case "BUY":
			switch (subCategory) {
				case "CLOTHING":
				case "ELECTRONICS":
				case "FURNITURE":
				case "HOME_KITCHEN":
				case "BOOKS_MUSIC_ENTERTAINMENTS":
				case "SPORTS_FITNESS":
				case "HEALTH_WELLNESS":
					return "amazonrealtimesearch";
				default:
					return "defaultTool";
			}
		case "BOOK":
			switch (subCategory) {
				case "FLIGHT":
					return "flightSearch";
				case "HOTEL":
					return "hotelSearch";
				case "EVENT_TICKETS":
					return "eventfinder";
				case "HOLIDAY":
					return "holidayfinder";
				case "CRUISE":
					return "cruisefinder";
				case "DOCTORS_APPOINTMENT":
				case "DENTIST_APPOINTMENT":
				case "TAXI":
				case "BUS_TICKETS":
				case "TRAIN_TICKETS":
				case "RESTAURANT":
				case "HAIR_APPOINTMENT":
					return `${subCategory.toLowerCase()}Tool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "ORDER":
			switch (subCategory) {
				case "FOOD":
				case "FLOWERS":
					return `${subCategory.toLowerCase()}OrderTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "WATCH":
			switch (subCategory) {
				case "MOVIE":
				case "TV_SHOW":
				case "ONLINE_VIDEO":
					return `${subCategory.toLowerCase()}WatchTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "READ":
			switch (subCategory) {
				case "BOOK":
				case "NEWSPAPER":
				case "WEBSITE":
				case "BLOG":
				case "FORUM_DISCUSSION_BOARDS":
					return `${subCategory.toLowerCase()}ReadTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "LISTEN":
			switch (subCategory) {
				case "RADIO_SHOW":
				case "PODCAST":
				case "MUSIC":
				case "AUDIOBOOKS":
				case "COURSES_LECTURES":
					return `${subCategory.toLowerCase()}ListenTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "JOIN":
			switch (subCategory) {
				case "GYM":
				case "CLUB":
				case "LIBRARY":
					return `${subCategory.toLowerCase()}HireTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "Hire":
			switch (subCategory) {
				case "CAR":
				case "STAFF":
				case "EQUIPMENT_MACHINERY":
					return `${subCategory.toLowerCase()}HireTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "BROWSE":
			switch (subCategory) {
				case "TWITTER":
				case "INSTAGRAM":
				case "TIK_TOK":
				case "TELEGRAM":
					return `${subCategory.toLowerCase()}BrowseTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "DONATE":
			switch (subCategory) {
				case "CLOTHING":
				case "MONEY":
					return `${subCategory.toLowerCase()}DonateTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "BANK":
			switch (subCategory) {
				case "AIB":
				case "PERMANENT_TSB":
					return `${subCategory.toLowerCase()}BankTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		case "GET_INFO":
			switch (subCategory) {
				case "WEATHER":
				case "SPORT":
				case "ENTERTAINMENT":
				case "SHOWBIZ":
					return `${subCategory.toLowerCase()}InfoTool`; // Placeholder for actual tool names
				default:
					return "defaultTool";
			}
		default:
			return "defaultTool";
	}
}

module.exports = determineToolName;
