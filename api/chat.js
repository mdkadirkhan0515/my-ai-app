const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // CORS Settings
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { message } = req.body;
    
    // Environment Variables চেক
    const apiKey = process.env.GEMINI_API_KEY;
    const fbUrl = process.env.FIREBASE_URL;

    if (!apiKey || !fbUrl) {
        return res.status(500).json({ reply: "Error: API Key or Firebase URL missing in Vercel settings!" });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const botReply = response.text(); // জেমিনির উত্তর

        // Firebase-এ ডাটা পাঠানো (ভুল হলে যেন অ্যাপ না থামে)
        try {
            await fetch(`${fbUrl}/chats.json`, {
                method: 'POST',
                body: JSON.stringify({ user: message, bot: botReply, time: new Date() }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) { console.log("Firebase Error:", e); }

        // সঠিক উত্তর পাঠানো
        res.status(200).json({ reply: botReply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Error: " + err.message });
    }
};
