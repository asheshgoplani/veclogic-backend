const { PineconeClient } = require("@pinecone-database/pinecone");
const fs = require("fs");
const { parse } = require("csv-parse");
const axios = require("axios");
require("dotenv").config();

let openai_api_key = process.env.OPENAI_API_KEY;

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

async function upsertItemToPinecone(product, vector) {
	try {
		// Prepare metadata object
		const metadata = {
			brand: product.Brand,
			category: product.Category,
			description: product.Description,
			price: product.Price,
			product_name: product.Product_Name,
			sub_category: product.Sub_Category,
		};

		// Prepare the data to be inserted into Pinecone
		const dataToInsert = {
			id: product.Product_ID,
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
(async () => {
	await initializePinecone();

	const parser = parse({ columns: true });
	const products = [];

	fs.createReadStream(
		"../Resources/Corrected_Extended_Product_Dataset.csv"
	).pipe(parser);
	parser.on("readable", () => {
		let record;
		while ((record = parser.read()) !== null) {
			products.push(record);
		}
	});

	parser.on("end", async () => {
		const embeddingsFile = "../Resources/product_embeddings.json";
		let existingEmbeddings = {};

		if (fs.existsSync(embeddingsFile)) {
			const data = fs.readFileSync(embeddingsFile, "utf8");
			existingEmbeddings = JSON.parse(data);
		}

		// Create an async function to handle operations for each product
		const handleProduct = async (product) => {
			let vector = existingEmbeddings[product.Product_ID];
			if (!vector) {
				vector = await generateEmbedding(product);
				existingEmbeddings[product.Product_ID] = vector;
				fs.writeFileSync(
					embeddingsFile,
					JSON.stringify(existingEmbeddings)
				);
			}
			await upsertItemToPinecone(product, vector);
		};

		// Use Promise.all to wait for all operations to complete
		await Promise.all(products.map(handleProduct));

		console.log("All operations successfully completed.");
	});
})();
