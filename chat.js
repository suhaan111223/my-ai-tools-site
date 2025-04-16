export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are BeChat, a helpful AI assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("OpenAI Response:", JSON.stringify(data)); // ✅ debug log

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ reply: "Error: No response from OpenAI." });
    }

    const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error); // ✅ error log
    return res.status(500).json({ reply: "Oops! Something went wrong." });
  }
}
