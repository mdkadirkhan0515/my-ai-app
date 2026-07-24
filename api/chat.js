const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // CORS সেটিংস
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { message } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const botReply = result.response.text();

    // Firebase-এ ডাটা সেভ করা
    await fetch(`${process.env.FIREBASE_URL}/chats.json`, {
      method: 'POST',
      body: JSON.stringify({ user: message, bot: botReply, time: new Date() }),
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).json({ reply: botReply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
