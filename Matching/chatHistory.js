const { getChatHistory } = require("../DataIngest/mongo"); // Adjust the path as necessary
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { userId, category, subCategory } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        // Fetch chat history
        let chatHistory = await getChatHistory({
            userId,
            category,
            subCategory,
            page,
            limit,
        });

        // Define the initial message
        const initialMessage = {
            message:  "I'm your Chatahoot Virtual Buddy, What can I help you with?",
            userId,
            category: category || "General",
            subCategory: subCategory || "InitialMessage",
            createdAt: new Date().toISOString(),
            senderType: "BOT",

        };




        if (chatHistory.length === 0) {
            // No chat history found, include initial message only if it's the first page
            if (page === 1) {
                chatHistory = [initialMessage];
            }
            res.json({
                success: true,
                message: "No chat history found.",
                data: chatHistory // This will be an array with the initial message if conditions are met
            });
        } else {
            // Chat history found, add initial message to the top if it's the first page and within limit
            if (page === 1 && chatHistory.length < limit) {
                chatHistory.unshift(initialMessage);
            }
            res.json({
                success: true,
                message: "",
                data: chatHistory
            });
        }
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving chat history."
        });
    }
});

module.exports = router;
