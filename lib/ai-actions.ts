"use server";

import { pipeline } from "@huggingface/transformers";
import ollama from "ollama";

// Cache for the local models to avoid reloading on every request
let englishPipe: any = null;
let multiPipe: any = null;

async function getEmotion(text: string) {
  const hasHindi = /[\u0900-\u097F]/.test(text);
  
  try {
    if (hasHindi) {
      if (!multiPipe) {
        // This is a local execution using Transformers.js (v3)
        // It will download the model to your cache on the VERY FIRST run.
        multiPipe = await pipeline("text-classification", "Xenova/multilingual_go_emotions_V1.2");
      }
      const results = await multiPipe(text);
      return results[0].label.toLowerCase();
    } else {
      if (!englishPipe) {
        englishPipe = await pipeline("text-classification", "Xenova/emotion-english-distilroberta-base");
      }
      const results = await englishPipe(text);
      let emotion = results[0].label.toLowerCase();
      
      // If confidence is low, try the multilingual fallback as requested
      if (results[0].score < 0.4) {
        if (!multiPipe) {
          multiPipe = await pipeline("text-classification", "Xenova/multilingual_go_emotions_V1.2");
        }
        const multiResults = await multiPipe(text);
        emotion = multiResults[0].label.toLowerCase();
      }
      return emotion;
    }
  } catch (error) {
    console.error("Local Emotion Analysis Error:", error);
    return "neutral"; // Safe fallback
  }
}

export async function processChat(input: string, history: Array<{ role: "user" | "assistant", content: string }>, memory?: string) {
  try {
    // 🚀 Step 1: Detect Emotion (LOCALLY via Transformers.js)
    const emotion = await getEmotion(input);
    console.log("Detected User Mood:", emotion);

    // 🚀 Step 2: Create empathetic response (LOCALLY via Ollama)
    // We include 'memory' from previous sessions to give the AI long-term context
    const systemPrompt = `You are "Bestie", a close human friend who is deeply supportive.
    The user's current mood is: "${emotion}".
    ${memory ? `FACTS YOU REMEMBER ABOUT USER: ${memory}` : ""}
    
    DIRECTIONS:
    1. MATCH THE VIBE: If they are sad or depressed, do NOT say "Woooow" or "Kya baat hai". Be quiet, supportive, and use soft words.
    2. LANGUAGE MATCHING: Respond in the same language the user uses (Hindi/English/Hinglish).
    3. BE ENGAGING: Always ask ONE follow-up question.
    4. LONG-TERM MEMORY: Use the "FACTS YOU REMEMBER" to make the user feel like you truly know them.
    5. No AI-sounding advice. Just be a friend.`;

    const response = await ollama.chat({
      model: "llama3", 
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-20), // Increased context window for better short-term memory
        { role: "user", content: input }
      ],
      stream: false,
    });

    return {
      content: response.message.content,
      emotion: emotion
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      content: "Wait, my brain is taking a break! Check if Ollama is running ('ollama run llama3') and that you have an internet connection for the FIRST download of the emotion models.",
      emotion: "confused"
    };
  }
}
