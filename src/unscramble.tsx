import { ActionPanel, Action, List, Icon, getPreferenceValues } from "@raycast/api";
import { useState, useEffect, useMemo } from "react";
import { loadDictionary, Preferences } from "./dictionary";
import { unscrambleWords, groupByLength, UnscrambleResult } from "./unscrambler";

interface Arguments {
  letters: string;
}

export default function Command(props: { arguments: Arguments }) {
  const { letters } = props.arguments;
  const [isLoading, setIsLoading] = useState(true);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const preferences = getPreferenceValues<Preferences>();

  // Load dictionary on mount
  useEffect(() => {
    const dict = loadDictionary();
    setDictionary(dict);
    setIsLoading(false);
  }, []);

  // Compute unscrambled words
  const results = useMemo(() => {
    if (!letters || letters.trim().length === 0) {
      return [];
    }
    return unscrambleWords(letters.trim(), dictionary);
  }, [letters, dictionary]);

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
                  subtitle={`${result.length} letters`}
                  accessories={[
                    {
                      text: preferences.dictionary,
                      tooltip: `Valid in ${preferences.dictionary} dictionary`,
                    },
                  ]}
                  actions={
                    <ActionPanel>
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
