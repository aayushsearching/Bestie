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

export async function processChat(input: string, history: Array<{ role: "user" | "assistant", content: string }>) {
  try {
    // 🚀 Step 1: Detect Emotion (LOCALLY via Transformers.js)
    const emotion = await getEmotion(input);
    console.log("Detected User Mood:", emotion); // This helps you see if the model is working

    // 🚀 Step 2: Create empathetic response (LOCALLY via Ollama)
    const systemPrompt = `You are "Bestie", a close human friend who is deeply supportive.
    The user's current mood is: "${emotion}".
    
    DIRECTIONS:
    1. MATCH THE VIBE: If they are sad or depressed, do NOT say "Woooow" or "Kya baat hai". Be quiet, supportive, and use soft words.
    2. LANGUAGE MATCHING: 
       - If the user talks in HINDI, you MUST respond in HINDI.
       - If the user talks in ENGLISH, you MUST respond in ENGLISH.
       - If the user uses HINGLISH, you MUST respond in HINGLISH.
    3. SLANG RULES:
       - POSITIVE MOOD: Use "Woooow", "Kya baat hai", "Cheer up yaar", "Maza aa gaya!".
       - SAD/DEPRESSING MOOD: Use "Hm, I'm here for you bro", "Koi baat nahi yaar", "Main hoon na", "Dil chota mat kar".
    4. BE ENGAGING: Always ask ONE follow-up question that is relevant, curious, or caring to keep the conversation going.
    5. Keep it short (1-2 sentences). Speak like a friend over WhatsApp.
    6. No AI-sounding advice unless asked.`;

    const response = await ollama.chat({
      model: "llama3", // Switch to "phi3" if you are running that in your terminal!
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10),
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
