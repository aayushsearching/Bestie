"use server";

import { pipeline } from "@huggingface/transformers";
import ollama from "ollama";
import { loadLocalMemory, saveLocalMemory } from "./memory-store";

// Cache for the local models to avoid reloading on every request
let englishPipe: any = null;
let multilingualPipe: any = null;

/**
 * Detects the emotion of a given text using local Hugging Face models.
 */
async function getEmotion(text: string): Promise<string> {
  try {
    if (!englishPipe) {
      englishPipe = await pipeline("text-classification", "j-hartmann/emotion-english-distilroberta-base");
    }

    const results = await englishPipe(text);
    const topEmotion = results[0]?.label || "neutral";
    
    if (topEmotion === "neutral") {
        if (!multilingualPipe) {
            multilingualPipe = await pipeline("text-classification", "AnasAlokla/multilingual_go_emotions_V1.2");
        }
        const multiResults = await multilingualPipe(text);
        return multiResults[0]?.label || "neutral";
    }

    return topEmotion;
  } catch (error) {
    console.error("Emotion detection failed:", error);
    return "neutral";
  }
}

/**
 * Main AI Server Action: Processes input through a local pipeline.
 */
export async function processChat(input: string, history: Array<{ role: "user" | "assistant", content: string }>, manualMemory?: string) {
  try {
    // 1. Load context memory from THE LOCAL FILE (Timeline format)
    const fileMemory = await loadLocalMemory();
    const fullMemory = [fileMemory, manualMemory].filter(Boolean).join("\n");
    
    // 2. Detect Emotion
    const emotion = await getEmotion(input);
    const now = new Date().toLocaleString();
    console.log(`[${now}] Mood: ${emotion}`);

    // 3. AI Generation + Extraction logic
    const systemPrompt = `You are "Bestie", a deeply empathetic local AI friend. 
    CURRENT TIME: "${now}".
    CURRENT MOOD: "${emotion}".
    THINGS YOU REMEMBER ABOUT USER (Timeline): 
    ---
    ${fullMemory}
    ---
    
    DIRECTIONS:
    1. SUPPORT: Be soft and caring for painful stories. Stay supportive.
    2. BE COMPACT: Keep chats 1-2 lines. Always ask a caring follow up question.
    3. TIMELINE LOGGING: If you learn something NEW about the user (events, feelings, people), you MUST summarize it clearly.
    4. NO HALLUCINATIONS: Only save facts the user explicitly stated. Never guess.

    OUTPUT FORMAT:
    [RESPONSE] Your message...
    [NEW_MEMORIES] (Summarize NEW facts learned in 1 line if any, else leave empty.)`;

    const response = await ollama.chat({
      model: "llama3", 
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-20),
        { role: "user", content: input }
      ],
      stream: false,
    });

    const output = response.message.content;
    
    // 4. Parse the AI's output
    let responseText = output.replace(/\[RESPONSE\]/i, "").split(/\[NEW_MEMORIES\]/i)[0].trim();
    const learnedMatch = output.match(/\[NEW_MEMORIES\]([\s\S]*)/i);
    const newFacts = learnedMatch ? learnedMatch[1].trim() : "";

    // 5. AUTO-SAVE fact to the timeline
    let latestMemory = fileMemory;
    if (newFacts && newFacts.length > 5) {
      const saved = await saveLocalMemory(newFacts);
      if (saved) latestMemory = saved;
    }

    return {
      content: responseText,
      emotion: emotion,
      memory: latestMemory
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
