# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with the Word Unscrambler for Raycast extension.

## Project Overview

**Name**: Word Unscrambler for Raycast
**Type**: Raycast Extension (TypeScript/React)
**Purpose**: Unscramble letters to find valid Scrabble words using CSW or NWL dictionaries
**Tech Stack**: TypeScript, React (via Raycast API), Node.js
**Author**: brentDes
**License**: MIT

## Codebase Structure

```
Unscrambler_Raycast/
├── src/
│   ├── unscramble.tsx      # Main command component (UI layer)
│   ├── unscrambler.ts      # Core word unscrambling logic
│   └── dictionary.ts       # Dictionary loading utilities
├── assets/
│   ├── icon.png            # Extension icon
│   ├── sample-words.txt    # Sample dictionary (included)
│   ├── CSW.txt            # (Optional) Collins Scrabble Words
│   └── NWL.txt            # (Optional) NASPA Word List
├── package.json            # Extension manifest & dependencies
├── tsconfig.json           # TypeScript configuration
├── .gitignore             # Git ignore rules
├── README.md              # User-facing documentation
└── CLAUDE.md              # This file - AI assistant guide
```

## Architecture & Design Patterns

### Core Components

1. **UI Layer** (`unscramble.tsx`)
   - React component using Raycast API
   - Manages state for dictionary and results
   - Uses React hooks: `useState`, `useEffect`, `useMemo`
   - Implements List interface with grouped sections
   - Line references: Full component at src/unscramble.tsx:10-103

2. **Business Logic** (`unscrambler.ts`)
   - Pure functions for word matching
   - Frequency map algorithm for letter matching
   - Blank tile (wildcard) support using `?` character
   - Key functions:
     - `canFormWord()` - src/unscrambler.ts:20-52
     - `unscrambleWords()` - src/unscrambler.ts:57-79
     - `groupByLength()` - src/unscrambler.ts:84-94

3. **Data Layer** (`dictionary.ts`)
   - File I/O for dictionary loading
   - Preference-based dictionary selection
   - Fallback mechanism (official → sample)
   - Key functions:
     - `loadDictionary()` - src/dictionary.ts:12-40
     - `getAvailableDictionaries()` - src/dictionary.ts:45-70

### Algorithm Explanation

The unscrambling algorithm uses frequency counting (src/unscrambler.ts:20-52):

1. **Input Processing**: Convert letters to lowercase, separate blanks (`?`) from regular letters
2. **Frequency Maps**: Create frequency maps for available letters and target word
3. **Matching Logic**: For each dictionary word:
   - Count how many of each letter the word needs
   - Check if available letters can satisfy the need
   - Calculate blanks needed for missing letters
   - Validate: blanks needed ≤ blanks available
4. **Sorting**: Results sorted by length (descending), then alphabetically

**Time Complexity**: O(n × m) where n = dictionary size, m = average word length
**Space Complexity**: O(n) for results storage

## Development Workflows

### Setup

```bash
# Install dependencies
npm install

# Start development mode (hot reload enabled)
npm run dev

# Build for production
npm run build
```

### Available Scripts

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm run dev` | Development mode with hot reload | Primary development command |
| `npm run build` | Build for production | Before publishing |
| `npm run lint` | Check code style | Run before commits |
| `npm run fix-lint` | Auto-fix linting issues | Fix formatting |
| `npm run publish` | Publish to Raycast Store | Deployment only |

### Git Workflow

- **Main Branch**: Default branch for stable code
- **Feature Branches**: Use `claude/` prefix for AI-assisted development
- **Commits**: Clear, descriptive messages following conventional commits style
- **Push**: Always to feature branches, never directly to main

## Key Conventions

### TypeScript

- **Strict Mode**: Enabled (tsconfig.json:7)
- **Target**: ES2021
- **Module System**: CommonJS (required by Raycast)
- **JSX**: React (for .tsx files)
- **No Implicit Any**: Strict type checking enforced

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Imports**: ES6 import syntax
- **Exports**: Named exports for utilities, default export for React components
- **Line Length**: No strict limit, but keep readable

### File Organization

- **Component Files**: `.tsx` extension for React components
- **Utility Files**: `.ts` extension for pure logic
- **Naming**:
  - Files: kebab-case (e.g., `unscramble.tsx`)
  - Functions: camelCase (e.g., `canFormWord`)
  - Types/Interfaces: PascalCase (e.g., `UnscrambleResult`)
  - Constants: UPPER_SNAKE_CASE (rare in this codebase)

### Raycast-Specific Conventions

- **Environment**: Access via `environment` object from `@raycast/api`
- **Preferences**: Use `getPreferenceValues<T>()` with typed interface
- **Assets**: Access via `environment.assetsPath`
- **Actions**: Wrapped in `<ActionPanel>` component
- **Icons**: Use Raycast's built-in `Icon` enum

## File-by-File Guide

### src/unscramble.tsx (Main Command)

**Purpose**: Primary UI component for the unscramble command
**Key Responsibilities**:
- Load dictionary on component mount (src/unscramble.tsx:17-21)
- Accept user input (letters argument)
- Compute and display unscrambled words
- Group results by word length
- Provide copy/paste actions

**Important Details**:
- Uses memoization (`useMemo`) for performance
- Dictionary loaded once on mount, cached in state
- Results computed reactively when letters change
- Empty states for no input and no results

**Action Items**:
- Copy to clipboard: `⌘+C`
- Paste to app: `⌘+V`

### src/unscrambler.ts (Core Logic)

**Purpose**: Pure business logic for word unscrambling
**Exports**:
- `UnscrambleResult` interface (src/unscrambler.ts:5-8)
- `canFormWord(word, letters)` - Check if word is formable
- `unscrambleWords(letters, dictionary)` - Find all valid words
- `groupByLength(results)` - Group words by length

**Key Algorithm**: Frequency counting with blank tile support
**No Side Effects**: Pure functions only
**No Dependencies**: Standard JS/TS only

### src/dictionary.ts (Data Loading)

**Purpose**: Load and manage Scrabble dictionaries
**Exports**:
- `Preferences` interface (src/dictionary.ts:5-7)
- `loadDictionary()` - Load dictionary based on preferences
- `getAvailableDictionaries()` - Check which dictionaries exist

**Fallback Strategy**:
1. Try official dictionary (CSW.txt or NWL.txt)
2. Fall back to sample-words.txt
3. Return empty array if all fail

**File Format**: One word per line, uppercase, trimmed

### package.json (Manifest)

**Critical Sections**:
- `commands`: Defines the unscramble command (package.json:15-49)
- `preferences`: Dictionary selection dropdown (package.json:51-69)
- `dependencies`: Raycast API and utils
- `scripts`: Build, dev, lint, publish commands

**Note**: This file is the extension manifest for Raycast. Changes here affect the extension's metadata and behavior.

### tsconfig.json (TypeScript Config)

**Key Settings**:
- Strict mode enabled for type safety
- ES2021 target for modern JS features
- CommonJS modules (Raycast requirement)
- React JSX support

**Do Not Modify** unless absolutely necessary.

## Common Tasks for AI Assistants

### Adding a New Feature

1. **Understand the request**: Clarify requirements with user
2. **Plan the change**: Identify which files need modification
3. **Update logic**: Modify `unscrambler.ts` for algorithm changes
4. **Update UI**: Modify `unscramble.tsx` for UI changes
5. **Update types**: Add/modify TypeScript interfaces as needed
6. **Test**: Run `npm run dev` and verify functionality
7. **Lint**: Run `npm run fix-lint` to ensure code style
8. **Document**: Update README.md if user-facing changes

### Fixing a Bug

1. **Reproduce**: Understand the bug and how to reproduce it
2. **Locate**: Identify the problematic code (likely in unscrambler.ts)
3. **Fix**: Make minimal, targeted changes
4. **Verify**: Test the fix thoroughly
5. **Check edge cases**: Test with blanks, empty input, long words, etc.

### Optimizing Performance

**Current Performance Characteristics**:
- Dictionary loaded once on mount (good)
- Results computed with `useMemo` (good)
- Linear scan of dictionary (acceptable for <500k words)

**If Optimization Needed**:
- Consider dictionary indexing (letter frequency pre-computation)
- Implement early termination for long words
- Cache results for repeated queries
- Use Web Workers for large dictionaries (advanced)

### Adding a New Dictionary

1. Obtain official dictionary file (CSW.txt or NWL.txt)
2. Format: one word per line, uppercase
3. Place in `assets/` directory
4. No code changes needed (automatic detection)
5. Update README.md with dictionary source info

## Testing & Quality

### Manual Testing Checklist

- [ ] Basic words (e.g., "hello")
- [ ] Scrambled words (e.g., "retinas")
- [ ] With blank tiles (e.g., "cat?")
- [ ] Multiple blanks (e.g., "??t")
- [ ] No results case
- [ ] Empty input
- [ ] Very long input (8+ letters)
- [ ] Switch between CSW and NWL dictionaries
- [ ] Copy action works
- [ ] Paste action works

### Code Quality

- Run `npm run lint` before committing
- Use `npm run fix-lint` to auto-fix issues
- Follow existing code patterns
- Add comments for complex logic only
- Keep functions small and focused

## Deployment & Publishing

### Pre-Publishing Checklist

1. [ ] All features working correctly
2. [ ] Linting passes (`npm run lint`)
3. [ ] Build succeeds (`npm run build`)
4. [ ] README.md is up to date
5. [ ] package.json version bumped (if needed)
6. [ ] No sensitive data in code
7. [ ] Assets (icon, dictionaries) are included

### Publishing to Raycast Store

```bash
npm run publish
```

**Requirements**:
- Raycast account with publishing permissions
- Extension must pass Raycast review guidelines
- Icon must meet Raycast standards (512x512, PNG)

## Important Notes for AI Assistants

### DO

- **Read code first**: Always read relevant files before making changes
- **Preserve types**: Maintain strict TypeScript typing
- **Follow patterns**: Use existing patterns in the codebase
- **Test thoroughly**: Verify changes work as expected
- **Minimize changes**: Make small, focused modifications
- **Use memoization**: Performance is important for good UX
- **Handle edge cases**: Empty input, no results, missing dictionaries
- **Maintain backwards compatibility**: Don't break existing functionality

### DON'T

- **Don't add dependencies** without strong justification
- **Don't modify tsconfig.json** unless absolutely necessary
- **Don't change package.json** structure without user approval
- **Don't remove error handling** or fallback mechanisms
- **Don't optimize prematurely**: Current performance is adequate
- **Don't add unnecessary complexity**: Keep it simple
- **Don't break the Raycast API contract**: Follow Raycast conventions
- **Don't commit directly to main**: Use feature branches

### Security Considerations

- **File I/O**: Dictionary loading uses synchronous reads (acceptable for assets)
- **User Input**: Letters argument is sanitized (trimmed, lowercased)
- **No External APIs**: All processing is local (good for privacy)
- **No Secrets**: No API keys or sensitive data needed

### Performance Guidelines

- **Dictionary Size**: CSW ~280k words, NWL ~190k words (manageable)
- **Load Time**: Dictionary loaded once on mount (~100-500ms acceptable)
- **Search Time**: O(n×m) is acceptable for interactive use
- **Memory**: Full dictionary in memory is fine for modern systems

### Raycast Extension Guidelines

- **User Preferences**: Defined in package.json, accessed via `getPreferenceValues()`
- **Assets Path**: Use `environment.assetsPath` for asset access
- **Icons**: Use Raycast's Icon enum for consistency
- **Actions**: Standard actions are Copy and Paste
- **Empty Views**: Always provide helpful empty states
- **Loading States**: Use `isLoading` prop for async operations

## Troubleshooting

### Common Issues

**Dictionary not loading**:
- Check assets/ directory exists
- Verify file permissions
- Check file format (one word per line, uppercase)
- Review console for error messages

**No words found**:
- Verify dictionary is loaded correctly
- Check input format (letters only, ? for blanks)
- Test with known valid words
- Confirm dictionary contains expected words

**Build errors**:
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run lint`
- Verify Node.js version compatibility

**Performance issues**:
- Check dictionary size (should be <500k words)
- Profile with React DevTools if available
- Review memoization dependencies

## Resources

- **Raycast API Docs**: https://developers.raycast.com
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **React Docs**: https://react.dev
- **Scrabble Dictionaries**: Contact WESPA (CSW) or NASPA (NWL)

## Version History

- **Current**: Initial version with CSW/NWL support, blank tiles, and grouped results
- **Future Considerations**:
  - Definition lookup
  - Word frequency/commonality scoring
  - Multiple language support
  - Anagram detection
  - Scrabble point calculation

---

**Last Updated**: 2025-11-19
**Maintained By**: brentDes
**For Questions**: See GitHub repository issues
