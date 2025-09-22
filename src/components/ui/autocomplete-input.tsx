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
  minCharsForSuggestion = 3,
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
    debounceMs: 300,
  });

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

      {/* Autocomplete Suggestion Indicator */}
      {showSuggestion && (suggestion.isLoading || suggestion.text) && (
        <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
          {suggestion.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          ) : suggestion.text ? (
            <div className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-500">Tab ↹</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Floating suggestion preview for inputs */}
      {showSuggestion && suggestion.text && !suggestion.isLoading && (
        <div className="absolute top-full right-0 left-0 z-20 mt-1">
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <span className="truncate text-blue-800">
                  <strong>Sugestão:</strong> {suggestion.text}
                </span>
              </div>
              <div className="ml-2 text-xs whitespace-nowrap text-blue-600">
                Tab ou → para aceitar
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
