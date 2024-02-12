const express = require("express");
const router = express.Router();
const { PineconeClient } = require("@pinecone-database/pinecone");
const fs = require("fs");
const { parse } = require("csv-parse");
const axios = require("axios");
require("dotenv").config();
const multer = require("multer");
// const parseSync = require("csv-parse/lib/sync");
const { importCSVData } = require("./mongo.js");
// const { parse } = require("csv-parse");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const openai_api_key = process.env.OPENAI_API_KEY;
const pinecone = new PineconeClient();

const indexName = "veclogic";
let index;

async function initializePinecone() {
	await pinecone.init({
		apiKey: process.env.PINECONE_API_KEY,
		environment: process.env.PINECONE_ENVIRONMENT,
	});

	const indexesList = await pinecone.listIndexes();

	if (!indexesList.includes(indexName)) {
		await pinecone.createIndex({
			createRequest: {
				name: indexName,
				dimension: 1536,
			},
		});
	}

	index = pinecone.Index(indexName);
}

async function generateEmbedding(product, model = "text-embedding-ada-002") {
	const serializedProduct = JSON.stringify(product);
	try {
		const response = await axios.post(
			"https://api.openai.com/v1/embeddings",
			{ input: [serializedProduct], model: model },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${openai_api_key}`,
				},
			}
		);
		return response.data.data[0].embedding;
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function upsertItemToPinecone(data, vector) {
	try {
		// Initialize metadata object
		let metadata = {};
		let id;

		// Populate metadata object dynamically
		for (const [key, value] of Object.entries(data)) {
			if (key.toLowerCase().includes("id")) {
				// Detect ID property
				id = value;
			} else {
				// Add to metadata
				metadata[key.toLowerCase()] = value;
			}
		}

		if (!id) {
			throw new Error(
				"ID field could not be detected in the data object."
			);
		}

		// Prepare the data to be inserted into Pinecone
		const dataToInsert = {
			id: id,
			values: vector,
			metadata: metadata, // Include metadata here
		};

		// Create an upsert request
		const upsertRequest = {
			vectors: [dataToInsert],
		};

		// Execute the upsert
		await index.upsert({ upsertRequest });
	} catch (error) {
		console.error("Error in Pinecone upsert:", error);
	}
}
router.post("/", upload.single("csvFile"), async (req, res) => {
	try {
		await initializePinecone();

		if (!req.file) {
			return res.status(400).json({ error: "No file provided" });
		}

		const csvBuffer = req.file.buffer.toString("utf8");

		let products = [];

		const parser = parse(csvBuffer, { columns: true });

		for await (const record of parser) {
			products.push(record);
		}
		const productsCopy = JSON.parse(JSON.stringify(products));
		await importCSVData(productsCopy);

		// const embeddingsFile = "../Resources/product_embeddings.json";
		let existingEmbeddings = {};

		// if (fs.existsSync(embeddingsFile)) {
		// 	const data = fs.readFileSync(embeddingsFile, "utf8");
		// 	existingEmbeddings = JSON.parse(data);
		// }

		const handleProduct = async (product) => {
			let vector = existingEmbeddings[product.Product_ID];
			if (!vector) {
				vector = await generateEmbedding(product);
				existingEmbeddings[product.Product_ID] = vector;
				// fs.writeFileSync(
				// 	embeddingsFile,
				// 	JSON.stringify(existingEmbeddings)
				// );
			}
			await upsertItemToPinecone(product, vector);
		};

		await Promise.all(products.map(handleProduct));

		res.status(200).json({
			message: "CSV data successfully imported into Pinecone.",
		});
	} catch (err) {
		console.error("An error occurred:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
module.exports = router;
