import { environment, getPreferenceValues } from "@raycast/api";
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
  const assetsPath = environment.assetsPath;

  try {
    // Try to load the official dictionary file first
    const dictionaryPath = join(assetsPath, `${dictionaryType}.txt`);
    const content = readFileSync(dictionaryPath, "utf-8");
    return content
      .split("\n")
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length > 0);
  } catch (error) {
    // Fall back to sample dictionary if official dictionary not found
    console.warn(`${dictionaryType} dictionary not found, using sample dictionary`);
    try {
      const samplePath = join(assetsPath, "sample-words.txt");
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
