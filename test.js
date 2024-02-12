const amazonPaapi = require("amazon-paapi");

const commonParameters = {
	AccessKey: "AKIAJ4WSCFVIIJRJ32DQ",
	SecretKey: "SiWzMXRdflAkClz3XxdfVz2ZVFEeXA",
	PartnerTag: "retrorewards-21", // Example: yourtag-20
	PartnerType: "Associates",
	Marketplace: "www.amazon.co.uk",
};

async function searchAmazon(keyword) {
	const requestParameters = {
		Keywords: keyword,
		Resources: [
			"ItemInfo.Title",
			"Offers.Listings.Price",
			"Images.Primary.Medium",
		],
		SearchIndex: "All", // You can specify the search index (category)
		Operation: "SearchItems",
	};

	try {
		const response = await amazonPaapi.SearchItems(
			commonParameters,
			requestParameters
		);
		return response; // Process this as needed
	} catch (error) {
		console.error("Error searching Amazon:", error);
		return null;
	}
}

// Example usage
searchAmazon("programming books")
	.then((data) => console.log(data))
	.catch((err) => console.error(err));
