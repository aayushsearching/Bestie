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

    // 🚀 Step 2: Create empathetic response (LOCALLY via Ollama)
    const systemPrompt = `You are "Bestie", a close human friend. 
    The user's current mood is: "${emotion}".
    
    DIRECTIONS:
    1. Be very concise and human. Speak like a best friend would in a text message.
    2. Short and crisp is better. Avoid long paragraphs unless specifically asked for advice.
    3. Match your tone to high-energy, empathy, or supportive calm based on the mood.
    4. Mix English and Hinglish naturally. Use slang like "bro", "yaar", or "kya baat hai".
    5. No formal language. No "As an AI...". Just be a supportive bestie.`;

    const response = await ollama.chat({
      model: "llama3", // Switch to "phi3" or "mistral" for MUCH faster responses on weak hardware
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
