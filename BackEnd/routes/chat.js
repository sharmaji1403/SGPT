import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIResponse from "../utils/OpenAi.js";

const router = express.Router();

//test route
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "12345",
            title: "Test Thread"
        });

        const response = await thread.save();
        res.send(response);

    } catch (error) {
        console.log("Error creating thread:", error);
        res.status(500).json({ error: "Error creating thread" });
    }
});

// Get all threads 
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //Descending order me threads ko sort karna taaki latest thread pehle aaye
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching threads" });
    }
});


// Get specific thread by ID
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching thread" });
    }
});

// Delete a thread by ID
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ message: "Thread deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting thread" });
    }
});

// Add a message to a thread
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    // Check if data is coming from Postman
    if (!threadId || !message) {
        return res.status(400).json({ error: "threadId and message are required" });
    }

    try {
        // FIX 1: 'let' use karein taaki thread ko re-assign kar sakein
        let thread = await Thread.findOne({ threadId });

        // AI se response mangwayein pehle
        const aiResponse = await getOpenAIResponse(message);

        // FIX 2: Check karein agar AI fail hua toh database update na karein
        if (!aiResponse) {
            return res.status(500).json({ error: "AI failed to respond. Check API Key/Model." });
        }

        if (!thread) {
            // Naya thread banayein
            thread = new Thread({
                threadId,
                title: message.substring(0, 30),
                messages: [
                    { role: "user", content: message },
                    { role: "assistant", content: aiResponse }
                ]
            });
        } else {
            // Purane thread mein dono messages push karein
            thread.messages.push({ role: "user", content: message });
            thread.messages.push({ role: "assistant", content: aiResponse });
        }

        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: aiResponse });

    } catch (error) {
        console.error("DB Error:", error.message);
        res.status(500).json({ error: "Error adding message to thread" });
    }
});


export default router;