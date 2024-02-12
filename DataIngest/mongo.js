const { MongoClient } = require("mongodb");

let client;
let db;

async function connect() {
	const uri =
		process.env.MONGODB_URI ||
		"mongodb://root:veclogic2023@localhost:27017";

	client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	db = client.db("generic-database");
}

async function disconnect() {
	if (client) {
		await client.close();
	}
}

async function importCSVData(data) {
	try {
		const collection = db.collection("generic-collection");
		const result = await collection.insertMany(data);
		console.log(`${result.insertedCount} documents were inserted`);
	} catch (err) {
		console.error("Error importing data: ", err);
	}
}

async function search(criteria) {
	try {
		console.log("Searching with criteria: ", criteria);
		const collection = db.collection("generic-collection");

		// Build a dynamic query
		let query = {};
		for (let [key, value] of Object.entries(criteria)) {
			query[key] = new RegExp(value, "i"); // Case-insensitive search
		}

		return await collection.find(query).toArray();
	} catch (err) {
		console.error("Error during search: ", err);
		throw err; // Propagate the error to the caller
	}
}

async function clearMongoDBCollection() {
	try {
		const collection = db.collection("generic-collection");
		await collection.deleteMany({}); // This will delete all documents in the collection
		console.log("All documents were deleted from the collection");
	} catch (err) {
		console.error("Error during clearing MongoDB collection: ", err);
		throw err; // Propagate the error to the caller
	}
}
// Existing imports and code...

// Function to save a chat message
async function saveChatMessage(messageData) {
	try {
		const collection = db.collection("chatMessages");
		await collection.insertOne(messageData);
		console.log("Chat message saved successfully");
	} catch (err) {
		console.error("Error saving chat message: ", err);
		throw err;
	}
}

// Function to retrieve chat history
async function getChatHistory({
	userId,
	category,
	subCategory,
	page,
	limit,
}) {
	try {
		const collection = db.collection("chatMessages");
		const query = { userId };
		if (category) query.category = category;
		if (subCategory) query.subCategory = subCategory;

		return await collection
			.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.toArray();
	} catch (err) {
		console.error("Error fetching chat history: ", err);
		throw err;
	}
}

module.exports = {
	connect,
	disconnect,
	importCSVData,
	search,
	clearMongoDBCollection,
	saveChatMessage, // Export new function
	getChatHistory, // Export new function
};
