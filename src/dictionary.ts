import { getPreferenceValues } from "@raycast/api";
import { readFileSync } from "fs";
import { join } from "path";

export interface Preferences {
  dictionary: "CSW" | "NWL";
}

/**
 * Loads the dictionary file based on user preference
 */
export function loadDictionary(): string[] {
  const preferences = getPreferenceValues<Preferences>();
  const dictionaryType = preferences.dictionary;

  try {
    // Try to load the official dictionary file first
    const dictionaryPath = join(__dirname, "..", "assets", `${dictionaryType}.txt`);
    const content = readFileSync(dictionaryPath, "utf-8");
    return content
      .split("\n")
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length > 0);
  } catch (error) {
    // Fall back to sample dictionary if official dictionary not found
    console.warn(`${dictionaryType} dictionary not found, using sample dictionary`);
    try {
      const samplePath = join(__dirname, "..", "assets", "sample-words.txt");
      const content = readFileSync(samplePath, "utf-8");
      return content
        .split("\n")
        .map((word) => word.trim().toUpperCase())
        .filter((word) => word.length > 0);
    } catch (sampleError) {
      console.error("Failed to load dictionary:", sampleError);
      return [];
    }
  }
}

/**
 * Gets available dictionaries
 */
export function getAvailableDictionaries(): string[] {
  const dictionaries: string[] = [];

  try {
    const cswPath = join(__dirname, "..", "assets", "CSW.txt");
    readFileSync(cswPath, "utf-8");
    dictionaries.push("CSW");
  } catch {
    // CSW not available
  }

  try {
    const nwlPath = join(__dirname, "..", "assets", "NWL.txt");
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
