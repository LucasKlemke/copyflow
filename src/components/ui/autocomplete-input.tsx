"use client";

import React, { useEffect, useRef, useState } from "react";

import { Lightbulb, Loader2 } from "lucide-react";

import { useAutocomplete } from "@/hooks/useAutocomplete";

import { Input } from "./input";

interface AutocompleteInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  enableAutocomplete?: boolean;
  minCharsForSuggestion?: number;
}

export function AutocompleteInput({
  value,
  onChange,
  enableAutocomplete = true,
  minCharsForSuggestion = 2,
  className,
  ...props
}: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const {
    suggestion,
    showSuggestion,
    getSuggestion,
    acceptSuggestion,
    clearSuggestion,
  } = useAutocomplete({
    enabled: enableAutocomplete,
    minChars: minCharsForSuggestion,
    realTime: true,
  });

  // Clean and prepare suggestion text for display
  const getCleanSuggestion = (suggestionText: string): string => {
    if (!suggestionText) return "";

    let clean = suggestionText.trim();

    // Remove common AI response patterns
    const patterns = [/^[""'"]\s*/, /\s*[""'"]$/, /^\s*[-–—]\s*/, /^\s*\.\s*/];

    patterns.forEach(pattern => {
      clean = clean.replace(pattern, "");
    });

    // If suggestion starts with part of what we already have, remove the duplicate
    const words = value.toLowerCase().split(/\s+/);
    const lastWord = words[words.length - 1];

    if (lastWord && clean.toLowerCase().startsWith(lastWord)) {
      clean = clean.slice(lastWord.length);
    }

    return clean;
  };

  // Track cursor position
  const handleSelectionChange = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart || 0;

    setCursorPosition(newCursorPosition);
    onChange(e);

    if (enableAutocomplete) {
      getSuggestion(newValue, newCursorPosition);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestion && suggestion.text && !suggestion.isLoading) {
      if (e.key === "Tab" || e.key === "ArrowRight") {
        e.preventDefault();
        const newValue = acceptSuggestion(value, cursorPosition);

        // Create a synthetic event to update the value
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);

        // Set cursor position after the accepted suggestion
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPos = cursorPosition + suggestion.text.length;
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            setCursorPosition(newCursorPos);
          }
        }, 0);
      } else if (e.key === "Escape") {
        clearSuggestion();
      }
    }

    // Call original onKeyDown if provided
    props.onKeyDown?.(e);
  };

  // Update cursor position on click or focus
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener("click", handleSelectionChange);
      input.addEventListener("keyup", handleSelectionChange);

      return () => {
        input.removeEventListener("click", handleSelectionChange);
        input.removeEventListener("keyup", handleSelectionChange);
      };
    }
  }, []);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />

      {/* Ghost Text Overlay for Input */}
      {showSuggestion && suggestion.text && !suggestion.isLoading && (
        <div className="pointer-events-none absolute top-0 left-0 flex h-full items-center">
          <div
            className="text-gray-400"
            style={{
              paddingLeft: `${value.length * 0.6}ch + 12px`, // Approximate character width + padding
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
          >
            {getCleanSuggestion(suggestion.text)}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {showSuggestion && suggestion.isLoading && (
        <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        </div>
      )}

      {/* Tab hint */}
      {showSuggestion && suggestion.text && !suggestion.isLoading && (
        <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Tab ↹</span>
          </div>
        </div>
      )}
    </div>
  );
}
