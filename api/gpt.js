// api/gpt.js

import OpenAI from "openai";

// Confirm API key is loading
console.log("API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://sailawaze.wpcomstaging.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Log incoming request body
    console.log("Incoming request body:", req.body);

    const { messages } = req.body;

    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    res.status(200).json({ reply: chat.choices[0].message.content });
  } catch (error) {
    // Log full error for better debugging
    console.error("GPT error:", error);
    res.status(500).json({ error: "Failed to get GPT response." });
  }
}
