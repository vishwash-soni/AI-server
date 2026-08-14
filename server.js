const express = require('express');
const Groq = require("groq-sdk");
const systemPrompt = require("./systemPrompt")
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(text) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role:"user",
        content:text
      }
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1,
  });
}

async function main(text) {
  const chatCompletion = await getGroqChatCompletion(text);
  return chatCompletion
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send("everything is good")
})


app.post('/',(req, res)=>{
  let text = req.body.text
  let responseChat = main(text);
    console.log(responseChat)
    responseChat.then((value)=>{
        res.send(value.choices[0].message.content)
    })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})