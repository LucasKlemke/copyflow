import { useCallback, useEffect, useRef, useState } from "react";

interface UseAutocompleteOptions {
  minChars?: number;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutocompleteSuggestion {
  text: string;
  isLoading: boolean;
}

export function useAutocomplete(options: UseAutocompleteOptions = {}) {
  const { minChars = 3, debounceMs = 300, enabled = true } = options;

  const [suggestion, setSuggestion] = useState<AutocompleteSuggestion>({
    text: "",
    isLoading: false,
  });
  const [showSuggestion, setShowSuggestion] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>();
  const lastPromptRef = useRef<string>("");

  const fetchSuggestion = useCallback(
    async (prompt: string) => {
      if (!enabled || prompt.length < minChars) {
        setSuggestion({ text: "", isLoading: false });
        setShowSuggestion(false);
        return;
      }

      // Don't fetch if we already have a suggestion for this prompt
      if (lastPromptRef.current === prompt) {
        return;
      }

      setSuggestion({ text: "", isLoading: true });
      setShowSuggestion(true);
      lastPromptRef.current = prompt;

      try {
        const response = await fetch("/api/autocomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestion");
        }

        const data = await response.json();
        setSuggestion({ text: data.suggestion || "", isLoading: false });
      } catch (error) {
        console.error("Autocomplete error:", error);
        setSuggestion({ text: "", isLoading: false });
        setShowSuggestion(false);
      }
    },
    [enabled, minChars]
  );

  const getSuggestion = useCallback(
    (text: string, cursorPosition: number) => {
      // Clear any existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Get the text up to the cursor position
      const textBeforeCursor = text.slice(0, cursorPosition);

      // Extract the last word or phrase for suggestion
      const words = textBeforeCursor.split(/\s+/);
      const lastWord = words[words.length - 1];

      // If we're in the middle of typing a word, use a broader context
      const contextLength = Math.min(30, textBeforeCursor.length);
      const context = textBeforeCursor.slice(-contextLength);

      debounceRef.current = setTimeout(() => {
        if (lastWord && lastWord.length >= minChars) {
          fetchSuggestion(context);
        } else {
          setSuggestion({ text: "", isLoading: false });
          setShowSuggestion(false);
        }
      }, debounceMs);
    },
    [fetchSuggestion, debounceMs, minChars]
  );

  const acceptSuggestion = useCallback(
    (currentText: string, cursorPosition: number) => {
      if (!suggestion.text) return currentText;

      const textBeforeCursor = currentText.slice(0, cursorPosition);
      const textAfterCursor = currentText.slice(cursorPosition);

      // Find the last incomplete word
      const words = textBeforeCursor.split(/\s+/);
      const lastWord = words[words.length - 1];

      // Replace the last word with the suggestion
      const beforeLastWord = words.slice(0, -1).join(" ");
      const newText =
        beforeLastWord +
        (beforeLastWord ? " " : "") +
        suggestion.text +
        textAfterCursor;

      setSuggestion({ text: "", isLoading: false });
      setShowSuggestion(false);
      lastPromptRef.current = "";

      return newText;
    },
    [suggestion.text]
  );

  const clearSuggestion = useCallback(() => {
    setSuggestion({ text: "", isLoading: false });
    setShowSuggestion(false);
    lastPromptRef.current = "";

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    suggestion,
    showSuggestion,
    getSuggestion,
    acceptSuggestion,
    clearSuggestion,
  };
}
