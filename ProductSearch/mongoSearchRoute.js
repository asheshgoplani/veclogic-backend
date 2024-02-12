const express = require("express");
const router = express.Router();
const { search } = require("../DataIngest/mongo");

router.post("/", async (req, res) => {
	const criteria = req.body.criteria;

	if (!criteria) {
		return res.status(400).json({ error: "Criteria required." });
	}

	try {
		const resultsArray = await search(criteria);

		// Format the response
		const response = {
			description: "", // Empty description as per your requirement
			results: resultsArray,
		};

		res.status(200).json(response);
	} catch (err) {
		console.error("An error occurred:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
module.exports = router;
