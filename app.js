const { connect, disconnect } = require("./DataIngest/mongo.js");
const mongoSearchRoute = require("./ProductSearch/mongoSearchRoute.js");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Import routes
const searchRoute = require("./ProductSearch/searchRoute");
const clearEmbeddingsRoute = require("./DeleteEmbeddings/clearEmbeddings.js");
const importCSVRoute = require("./DataIngest/importCSVToPinecone");
const sendMessage = require("./Matching/sendMessage.js");
const chatHistoryRoute = require("./Matching/chatHistory");

// Use routes
app.use("/search", searchRoute);
app.use("/clear-embeddings", clearEmbeddingsRoute);
app.use("/import-csv", importCSVRoute);
app.use("/mongo-search", mongoSearchRoute);

app.use("/send-message", sendMessage);
app.use("/get-chat-history", chatHistoryRoute);

// app.listen(port, () => {
// 	console.log(`Listening at http://localhost:${port}`);
// });

connect()
	.then(() => {
		app.listen(port, () => {
			console.log(`Listening at http://localhost:${port}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB:", err);
	});
