import { ActionPanel, Action, List, Icon, getPreferenceValues, Detail } from "@raycast/api";
import { useState, useEffect, useMemo } from "react";
import { loadDictionary, Preferences, DictionaryData } from "./dictionary";
import { unscrambleWords, groupByLength, UnscrambleResult } from "./unscrambler";

interface Arguments {
  letters: string;
}

function WordDetail({ result }: { result: UnscrambleResult }) {
  const markdown = `# ${result.word}

${result.definition ? `## Definition\n${result.definition}\n` : ""}
${
  result.frontHooks || result.backHooks
    ? `## Hooks\n${result.frontHooks ? `**Front hooks:** ${result.frontHooks}\n` : ""}${result.backHooks ? `**Back hooks:** ${result.backHooks}\n` : ""}`
    : ""
}

## Word Info
- **Length:** ${result.length} letters
- **Word:** ${result.word}
`;

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Word" content={result.word} shortcut={{ modifiers: ["cmd"], key: "c" }} />
          <Action.Paste title="Paste Word" content={result.word} shortcut={{ modifiers: ["cmd"], key: "v" }} />
        </ActionPanel>
      }
    />
  );
}

export default function Command(props: { arguments: Arguments }) {
  const { letters } = props.arguments;
  const [isLoading, setIsLoading] = useState(true);
  const [dictionaryData, setDictionaryData] = useState<DictionaryData>({ words: [], wordMap: new Map() });
  const preferences = getPreferenceValues<Preferences>();

  // Load dictionary on mount
  useEffect(() => {
    const data = loadDictionary();
    setDictionaryData(data);
    setIsLoading(false);
  }, []);

  // Compute unscrambled words
  const results = useMemo(() => {
    if (!letters || letters.trim().length === 0) {
      return [];
    }
    return unscrambleWords(letters.trim(), dictionaryData.words, dictionaryData.wordMap);
  }, [letters, dictionaryData]);

  // Group results by length
  const grouped = useMemo(() => {
    return groupByLength(results);
  }, [results]);

  // Get sorted length keys (descending)
  const lengthKeys = useMemo(() => {
    return Array.from(grouped.keys()).sort((a, b) => b - a);
  }, [grouped]);

  const getSubtitle = () => {
    if (isLoading) return "Loading dictionary...";
    if (!letters || letters.trim().length === 0) return "Enter letters to unscramble";
    return `Found ${results.length} word${results.length !== 1 ? "s" : ""} using ${preferences.dictionary} dictionary`;
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter letters (use ? for blanks)"
      navigationTitle="Unscramble Words"
    >
      {!letters || letters.trim().length === 0 ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="Enter Letters to Unscramble"
          description="Use ? to represent blank tiles (wildcards)"
        />
      ) : results.length === 0 ? (
        <List.EmptyView
          icon={Icon.XMarkCircle}
          title="No Words Found"
          description={`No valid words found in the ${preferences.dictionary} dictionary`}
        />
      ) : (
        lengthKeys.map((length) => {
          const words = grouped.get(length) || [];
          return (
            <List.Section key={length} title={`${length} Letters (${words.length} word${words.length !== 1 ? "s" : ""})`}>
              {words.map((result) => (
                <List.Item
                  key={result.word}
                  title={result.word}
                  subtitle={result.definition ? result.definition.substring(0, 100) + (result.definition.length > 100 ? "..." : "") : `${result.length} letters`}
                  accessories={[
                    ...(result.frontHooks || result.backHooks
                      ? [
                          {
                            text: `${result.frontHooks ? "←" + result.frontHooks : ""}${result.backHooks ? result.backHooks + "→" : ""}`,
                            tooltip: "Hooks",
                          },
                        ]
                      : []),
                    {
                      text: preferences.dictionary,
                      tooltip: `Valid in ${preferences.dictionary} dictionary`,
                    },
                  ]}
                  actions={
                    <ActionPanel>
                      {result.definition && (
                        <Action.Push
                          title="View Definition"
                          target={<WordDetail result={result} />}
                          icon={Icon.Book}
                        />
                      )}
                      <Action.CopyToClipboard
                        title="Copy Word"
                        content={result.word}
                        shortcut={{ modifiers: ["cmd"], key: "c" }}
                      />
                      <Action.Paste
                        title="Paste Word"
                        content={result.word}
                        shortcut={{ modifiers: ["cmd"], key: "v" }}
                      />
                    </ActionPanel>
                  }
                />
              ))}
            </List.Section>
          );
        })
      )}
    </List>
  );
}
