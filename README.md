# Word Unscrambler for Raycast

A Raycast extension that unscrambles letters to find valid Scrabble words using CSW or NWL dictionaries.

## Features

- 🎯 Support for both CSW (Collins Scrabble Words) and NWL (North American Word List) dictionaries
- 🃏 Blank tile support using `?` character as wildcards
- ⚡ Fast word lookup and matching algorithm
- 📊 Results sorted by word length (longest first) and alphabetically
- 📋 Copy or paste words directly from results
- 🎨 Clean, intuitive interface with grouped results

## Installation

### For Development

1. Clone this repository:
   ```bash
   git clone https://github.com/brentDes/Unscrambler_Raycast.git
   cd Unscrambler_Raycast
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

### For Production Use

Install from the Raycast Store (once published) or import this extension into Raycast.

## Adding Official Dictionaries

The extension comes with a sample dictionary for demonstration. To use the official CSW or NWL dictionaries:

1. Obtain the dictionary files (CSW.txt or NWL.txt) from official sources:
   - **CSW**: Available from Collins Scrabble Words official sources
   - **NWL**: Available through NASPA (North American Scrabble Players Association) licensing

2. Format the dictionary files:
   - Each file should contain one word per line
   - Words should be in uppercase
   - Remove any blank lines or comments

3. Place the dictionary files in the `assets/` directory:
   ```
   Unscrambler_Raycast/
   ├── assets/
   │   ├── CSW.txt          # Collins Scrabble Words
   │   ├── NWL.txt          # North American Word List
   │   ├── sample-words.txt # Sample dictionary (included)
   │   └── icon.png
   ```

4. The extension will automatically detect and use the dictionaries

**Note**: The sample dictionary is provided for demonstration only. For competitive Scrabble play, please use official CSW or NWL dictionaries.

## Usage

### Basic Usage

1. Open Raycast (⌘ + Space or your configured hotkey)
2. Type "Unscramble Words" or create a hotkey for quick access
3. Enter your letters in the argument field
4. Browse the list of valid words, grouped by length

### Using Blank Tiles

Use `?` to represent blank/wildcard tiles:

- `cat?` - finds words using C, A, T, and one blank
- `??t` - finds words with two blanks and the letter T
- `scrab?le` - finds words using those letters with one blank

### Examples

- **Input**: `hello`
  **Output**: Words like HELLO, HELL, HOLE, etc.

- **Input**: `retinas`
  **Output**: RETINAS, RETAINS, NASTIER, STAINER, etc.

- **Input**: `play?`
  **Output**: PLAYS, PLAYA, LAYUP, etc. (where ? can be any letter)

### Actions

For each word in the results, you can:
- **Copy**: Press ⌘+C to copy the word to clipboard
- **Paste**: Press ⌘+V to paste the word to the frontmost application

## Configuration

Access extension preferences in Raycast settings:

- **Dictionary**: Choose between CSW (Collins Scrabble Words) or NWL (North American Word List)
  - CSW: Used in most countries for competitive Scrabble
  - NWL: Used primarily in North America (USA, Canada, Israel)

## Development

### Project Structure

```
Unscrambler_Raycast/
├── src/
│   ├── unscramble.tsx      # Main command component
│   ├── unscrambler.ts      # Word unscrambling logic
│   └── dictionary.ts       # Dictionary loading utilities
├── assets/
│   ├── icon.png            # Extension icon
│   ├── sample-words.txt    # Sample dictionary
│   ├── CSW.txt            # (Optional) Collins Scrabble Words
│   └── NWL.txt            # (Optional) NASPA Word List
├── package.json
├── tsconfig.json
└── README.md
```

### Build Commands

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run fix-lint

# Publish to Raycast Store
npm run publish
```

## Algorithm

The extension uses an efficient letter-matching algorithm:

1. **Letter Frequency Counting**: Creates frequency maps for both available letters and target words
2. **Blank Tile Matching**: Calculates how many blanks are needed to complete each word
3. **Validation**: Checks if the word can be formed with available letters and blanks
4. **Sorting**: Results are sorted by length (descending) then alphabetically

Time Complexity: O(n * m) where n is dictionary size and m is average word length

## License

MIT

## Credits

Created by brentDes for the Raycast community.

## Support

For issues, questions, or contributions, please visit the GitHub repository.
