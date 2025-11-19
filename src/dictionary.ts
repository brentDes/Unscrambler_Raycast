import { environment, getPreferenceValues } from "@raycast/api";
import { readFileSync } from "fs";
import { join } from "path";
import { WordEntry } from "./unscrambler";

export interface Preferences {
  dictionary: "CSW" | "NWL";
}

export interface DictionaryData {
  words: string[];
  wordMap: Map<string, WordEntry>;
}

/**
 * Parses CSV data and returns word map
 */
function parseCSV(content: string): DictionaryData {
  const lines = content.split("\n");
  const words: string[] = [];
  const wordMap = new Map<string, WordEntry>();

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle quoted fields with commas)
    const fields: string[] = [];
    let currentField = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(currentField);
        currentField = "";
      } else {
        currentField += char;
      }
    }
    fields.push(currentField); // Add last field

    if (fields.length >= 4) {
      // Remove special markers like · from word
      const word = fields[0].trim().replace(/·/g, "").toUpperCase();
      const definition = fields[1].trim();
      const frontHooks = fields[2].trim();
      const backHooks = fields[3].trim();

      if (word) {
        words.push(word);
        wordMap.set(word, {
          word,
          definition: definition || undefined,
          frontHooks: frontHooks || undefined,
          backHooks: backHooks || undefined,
        });
      }
    }
  }

  return { words, wordMap };
}

/**
 * Loads the dictionary file based on user preference
 */
export function loadDictionary(): DictionaryData {
  const preferences = getPreferenceValues<Preferences>();
  const dictionaryType = preferences.dictionary;
  const assetsPath = environment.assetsPath;

  // First, try to load the CSV file from src directory
  try {
    const csvPath = join(assetsPath, "..", "src", "csw24_complete_wordlist.csv");
    const content = readFileSync(csvPath, "utf-8");
    console.log("Loaded CSV dictionary with definitions");
    return parseCSV(content);
  } catch (csvError) {
    console.warn("CSV dictionary not found, falling back to text dictionary");
  }

  // Fall back to text-based dictionaries
  try {
    // Try to load the official dictionary file first
    const dictionaryPath = join(assetsPath, `${dictionaryType}.txt`);
    const content = readFileSync(dictionaryPath, "utf-8");
    const words = content
      .split("\n")
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length > 0);
    return { words, wordMap: new Map() };
  } catch (error) {
    // Fall back to sample dictionary if official dictionary not found
    console.warn(`${dictionaryType} dictionary not found, using sample dictionary`);
    try {
      const samplePath = join(assetsPath, "sample-words.txt");
      const content = readFileSync(samplePath, "utf-8");
      const words = content
        .split("\n")
        .map((word) => word.trim().toUpperCase())
        .filter((word) => word.length > 0);
      return { words, wordMap: new Map() };
    } catch (sampleError) {
      console.error("Failed to load dictionary:", sampleError);
      return { words: [], wordMap: new Map() };
    }
  }
}

/**
 * Gets available dictionaries
 */
export function getAvailableDictionaries(): string[] {
  const dictionaries: string[] = [];
  const assetsPath = environment.assetsPath;

  try {
    const cswPath = join(assetsPath, "CSW.txt");
    readFileSync(cswPath, "utf-8");
    dictionaries.push("CSW");
  } catch {
    // CSW not available
  }

  try {
    const nwlPath = join(assetsPath, "NWL.txt");
    readFileSync(nwlPath, "utf-8");
    dictionaries.push("NWL");
  } catch {
    // NWL not available
  }

  if (dictionaries.length === 0) {
    dictionaries.push("Sample");
  }

  return dictionaries;
}
