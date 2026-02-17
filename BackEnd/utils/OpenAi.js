import "dotenv/config";

const getOpenAIResponse = async (message) => {
    const API_KEY = process.env.OPENAI_API_KEY;

    // EXACT MODEL ID jo aapki list se mili
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const bodyContent = {
        contents: [{ parts: [{ text: message }] }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyContent)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error Detail:", data);
            return null;
        }

        // Gemini ka standard response path
        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        }
        
        return null;

    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
};

export default getOpenAIResponse;