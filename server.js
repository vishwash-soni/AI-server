require("dotenv").config();

const express = require("express");
const Groq = require("groq-sdk");
const systemPrompt = require("./systemPrompt");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

async function getGroqChatCompletion(text) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: text
      }
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1
  });
}

app.get("/", (req, res) => {
  res.send("Everything is good");
});

app.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    console.log("Received:", text);

    const chatCompletion = await getGroqChatCompletion(text);

    const response =
      chatCompletion.choices[0]?.message?.content || "";

    res.json(response)

  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      error: "Failed to generate response"
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});