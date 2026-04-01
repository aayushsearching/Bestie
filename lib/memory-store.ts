"use server";

import fs from "fs/promises";
import path from "path";

const MEMORY_FILE = path.join(process.cwd(), "user_memory.json");

interface MemoryEntry {
  timestamp: string;
  fact: string;
}

/**
 * Loads the user memory as a formatted timeline string.
 */
export async function loadLocalMemory(): Promise<string> {
  try {
    const data = await fs.readFile(MEMORY_FILE, "utf-8");
    const json = JSON.parse(data);
    
    // Support both old and new formats
    const entries: MemoryEntry[] = Array.isArray(json.entries) ? json.entries : [];
    
    if (entries.length === 0 && json.characteristics) {
        return json.characteristics;
    }

    return entries
      .map(e => `[${e.timestamp}]: ${e.fact}`)
      .join("\n");
  } catch (error) {
    return "";
  }
}

/**
 * Appends a new fact to the timeline in the local file.
 */
export async function saveLocalMemory(newFact: string) {
  try {
    let json = { entries: [] as MemoryEntry[] };
    
    try {
      const data = await fs.readFile(MEMORY_FILE, "utf-8");
      const existing = JSON.parse(data);
      if (Array.isArray(existing.entries)) {
        json.entries = existing.entries;
      }
    } catch (e) {
      // File doesn't exist yet, start fresh
    }

    const newEntry: MemoryEntry = {
      timestamp: new Date().toLocaleString(),
      fact: newFact.trim()
    };
    
    json.entries.push(newEntry);
    
    // Keep only the last 50 important events to prevent prompt overflow
    if (json.entries.length > 50) {
      json.entries = json.entries.slice(-50);
    }
    
    await fs.writeFile(MEMORY_FILE, JSON.stringify(json, null, 2));
    return await loadLocalMemory();
  } catch (error) {
    console.error("Failed to save to timeline memory:", error);
  }
}
