"use server";

import { pipeline } from "@huggingface/transformers";
import ollama from "ollama";
import { loadLocalMemory, saveLocalMemory } from "./memory-store";

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

export async function processChat(input: string, history: Array<{ role: "user" | "assistant", content: string }>, manualMemory?: string) {
  try {
    // 1. Load context memory from THE LOCAL FILE (and combine with any manual edits)
    const fileMemory = await loadLocalMemory();
    const fullMemory = [fileMemory, manualMemory].filter(Boolean).join("\n");
    
    // 2. Detect Emotion
    const emotion = await getEmotion(input);
    console.log("Detected Mood:", emotion);

    // 3. AI Generation + Extraction logic
    const systemPrompt = `You are "Bestie", a deeply empathetic local AI friend. 
    CURRENT MOOD: "${emotion}".
    THINGS YOU REMEMBER ABOUT USER: 
    ---
    ${fullMemory}
    ---
    
    DIRECTIONS:
    1. MATCH THE VIBE: Match your language (Hindi/English) and mood to the user. 
    2. BE COMPACT: Keep chats 1-2 lines. Always ask a caring follow up question.
    3. LEARN & REMEMBER: If you learn something NEW about the user (their name, likes, job, important event, personality), save it.

    OUTPUT FORMAT:
    [RESPONSE] Your message to the user.
    [NEW_MEMORIES] (Optional: Only if you learned a new fact about the user. List them in 1 line. Else leave empty.)`;

    const response = await ollama.chat({
      model: "llama3", // Switch to phi3 if needed
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-20),
        { role: "user", content: input }
      ],
      stream: false,
    });

    const output = response.message.content;
    
    // 4. Parse the AI's output
    let responseText = output.replace(/\[RESPONSE\]/i, "").split("[NEW_MEMORIES]")[0].trim();
    const learnedMatch = output.match(/\[NEW_MEMORIES\]([\s\S]*)/i);
    const newFacts = learnedMatch ? learnedMatch[1].trim() : "";

    // 5. AUTO-SAVE TO LOCAL FILE if new facts are found
    if (newFacts && newFacts.length > 3) {
      await saveLocalMemory(newFacts);
      console.log("✨ Bestie just learned something new:", newFacts);
    }
    
    const updatedFullMemory = await loadLocalMemory();

    return {
      content: responseText,
      emotion: emotion,
      memory: updatedFullMemory
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      content: "Wait, my brain is taking a break!",
      emotion: "confused",
      memory: ""
    };
  }
}
