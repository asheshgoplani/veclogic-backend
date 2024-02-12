const { connect, disconnect, search } = require("./mongo.js"); // Replace with the path to your MongoDB connection file

async function verifyData() {
	try {
		// Connect to MongoDB
		await connect();

		// Search for all documents in your collection
		// An empty object as the criteria will match all documents in the collection
		const data = await search({});

		// Log the data to the console
		console.log(data);
	} catch (error) {
		console.error("An error occurred:", error);
	} finally {
		// Disconnect from MongoDB
		await disconnect();
	}
}

// Execute the function
verifyData();
