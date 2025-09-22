import { useCallback, useEffect, useRef, useState } from "react";

interface UseAutocompleteOptions {
  minChars?: number;
  enabled?: boolean;
  realTime?: boolean;
}

interface AutocompleteSuggestion {
  text: string;
  isLoading: boolean;
}

export function useAutocomplete(options: UseAutocompleteOptions = {}) {
  const { minChars = 2, enabled = true, realTime = true } = options;

  const [suggestion, setSuggestion] = useState<AutocompleteSuggestion>({
    text: "",
    isLoading: false,
  });
  const [showSuggestion, setShowSuggestion] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>();
  const lastPromptRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestion = useCallback(
    async (prompt: string) => {
      if (!enabled || prompt.length < minChars) {
        setSuggestion({ text: "", isLoading: false });
        setShowSuggestion(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Don't fetch if we already have a suggestion for this prompt
      if (lastPromptRef.current === prompt) {
        return;
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

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
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestion");
        }

        const data = await response.json();
        setSuggestion({ text: data.suggestion || "", isLoading: false });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Autocomplete error:", error);
          setSuggestion({ text: "", isLoading: false });
          setShowSuggestion(false);
        }
      }
    },
    [enabled, minChars]
  );

  const getSuggestion = useCallback(
    (text: string, cursorPosition: number) => {
      // Get the text up to the cursor position
      const textBeforeCursor = text.slice(0, cursorPosition);

      // Check if we have enough context to make suggestions
      // We should suggest if:
      // 1. We have at least minChars characters overall, OR
      // 2. We have a recent word that's being typed, OR
      // 3. We just finished a word (ended with space) and can suggest next word

      const trimmedText = textBeforeCursor.trim();
      const words = textBeforeCursor.split(/\s+/);
      const lastWord = words[words.length - 1];
      const endsWithSpace = textBeforeCursor.endsWith(" ");

      // Calculate context for suggestion
      const contextLength = Math.min(80, textBeforeCursor.length);
      const context = textBeforeCursor.slice(-contextLength);

      // Determine if we should show suggestions
      const shouldSuggest =
        trimmedText.length >= minChars &&
        // Currently typing a word
        ((lastWord && lastWord.length >= 1) ||
          // Just finished a word and context is meaningful
          (endsWithSpace && trimmedText.length >= 5) ||
          // Has substantial context
          trimmedText.length >= 10);

      if (realTime) {
        // Real-time suggestions without debounce
        if (shouldSuggest) {
          fetchSuggestion(context);
        } else {
          setSuggestion({ text: "", isLoading: false });
          setShowSuggestion(false);
        }
      } else {
        // Clear any existing timeout for debounced mode
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          if (shouldSuggest) {
            fetchSuggestion(context);
          } else {
            setSuggestion({ text: "", isLoading: false });
            setShowSuggestion(false);
          }
        }, 300);
      }
    },
    [fetchSuggestion, minChars, realTime]
  );

  const acceptSuggestion = useCallback(
    (currentText: string, cursorPosition: number) => {
      if (!suggestion.text) return currentText;

      const textBeforeCursor = currentText.slice(0, cursorPosition);
      const textAfterCursor = currentText.slice(cursorPosition);

      // Clean up the suggestion text (remove any unwanted prefixes)
      let cleanSuggestion = suggestion.text.trim();

      // Remove common AI response patterns that might repeat the input
      const patterns = [
        /^[""'"]\s*/, // Remove quotes at start
        /\s*[""'"]$/, // Remove quotes at end
        /^\s*[-–—]\s*/, // Remove dashes
        /^\s*\.\s*/, // Remove dots
      ];

      patterns.forEach(pattern => {
        cleanSuggestion = cleanSuggestion.replace(pattern, "");
      });

      // If suggestion starts with part of what we already have, remove the duplicate
      const words = textBeforeCursor.toLowerCase().split(/\s+/);
      const lastWord = words[words.length - 1];

      if (lastWord && cleanSuggestion.toLowerCase().startsWith(lastWord)) {
        cleanSuggestion = cleanSuggestion.slice(lastWord.length);
      }

      // Simply append the suggestion at the cursor position
      const newText = textBeforeCursor + cleanSuggestion + textAfterCursor;

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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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
