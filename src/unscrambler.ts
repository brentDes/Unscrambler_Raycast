/**
 * Word unscrambler utility functions
 */

export interface UnscrambleResult {
  word: string;
  length: number;
}

/**
 * Sorts the letters in a string alphabetically
 */
function sortLetters(str: string): string {
  return str.split("").sort().join("");
}

/**
 * Checks if a word can be formed from the given letters (including blanks represented by ?)
 */
export function canFormWord(word: string, letters: string): boolean {
  const wordLower = word.toLowerCase();
  const lettersLower = letters.toLowerCase();

  // Count available letters (excluding blanks)
  const availableLetters = lettersLower.replace(/\?/g, "");
  const blankCount = lettersLower.length - availableLetters.length;

  // Create frequency maps
  const availableFreq: { [key: string]: number } = {};
  for (const char of availableLetters) {
    availableFreq[char] = (availableFreq[char] || 0) + 1;
  }

  // Check if word can be formed
  let blanksNeeded = 0;
  const wordFreq: { [key: string]: number } = {};

  for (const char of wordLower) {
    wordFreq[char] = (wordFreq[char] || 0) + 1;
  }

  for (const char in wordFreq) {
    const needed = wordFreq[char];
    const available = availableFreq[char] || 0;

    if (needed > available) {
      blanksNeeded += needed - available;
    }
  }

  return blanksNeeded <= blankCount;
}

/**
 * Unscrambles letters and returns all valid words from the dictionary
 */
export function unscrambleWords(letters: string, dictionary: string[]): UnscrambleResult[] {
  const results: UnscrambleResult[] = [];

  // Filter words that can be formed from the given letters
  for (const word of dictionary) {
    if (word.length <= letters.length && canFormWord(word, letters)) {
      results.push({
        word: word.toUpperCase(),
        length: word.length,
      });
    }
  }

  // Sort by length (descending) then alphabetically
  results.sort((a, b) => {
    if (a.length !== b.length) {
      return b.length - a.length; // Longer words first
    }
    return a.word.localeCompare(b.word); // Alphabetically
  });

  return results;
}

/**
 * Groups words by length
 */
export function groupByLength(results: UnscrambleResult[]): Map<number, UnscrambleResult[]> {
  const grouped = new Map<number, UnscrambleResult[]>();

  for (const result of results) {
    const existing = grouped.get(result.length) || [];
    existing.push(result);
    grouped.set(result.length, existing);
  }

  return grouped;
}
