import fs from "fs/promises";
import path from "path";

const MEMORY_FILE = path.join(process.cwd(), "user_memory.json");

/**
 * Loads the user memory from the local file.
 */
export async function loadLocalMemory(): Promise<string> {
  try {
    const data = await fs.readFile(MEMORY_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.characteristics || "";
  } catch (error) {
    // If file doesn't exist, start with empty memory
    return "";
  }
}

/**
 * Saves/Appends new characteristics to the local file.
 */
export async function saveLocalMemory(newFacts: string) {
  try {
    const currentMemory = await loadLocalMemory();
    
    // We combine the current memory with new facts (you could also use an LLM to deduplicate later)
    const updatedMemory = `${currentMemory}\n${newFacts}`.trim();
    
    await fs.writeFile(MEMORY_FILE, JSON.stringify({ 
      characteristics: updatedMemory,
      lastUpdated: new Date().toISOString() 
    }, null, 2));
    
    return updatedMemory;
  } catch (error) {
    console.error("Failed to save local memory file:", error);
  }
}
