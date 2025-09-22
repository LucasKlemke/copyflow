"use client";

import React, { useEffect, useRef, useState } from "react";

import { Lightbulb, Loader2 } from "lucide-react";

import { useAutocomplete } from "@/hooks/useAutocomplete";

import { Textarea } from "./textarea";

interface AutocompleteTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enableAutocomplete?: boolean;
  minCharsForSuggestion?: number;
}

export function AutocompleteTextarea({
  value,
  onChange,
  enableAutocomplete = true,
  minCharsForSuggestion = 3,
  className,
  ...props
}: AutocompleteTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    debounceMs: 500,
  });

  // Track cursor position
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart || 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart || 0;

    setCursorPosition(newCursorPosition);
    onChange(e);

    if (enableAutocomplete) {
      getSuggestion(newValue, newCursorPosition);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestion && suggestion.text && !suggestion.isLoading) {
      if (e.key === "Tab" || e.key === "ArrowRight") {
        e.preventDefault();
        const newValue = acceptSuggestion(value, cursorPosition);

        // Create a synthetic event to update the value
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onChange(syntheticEvent);

        // Set cursor position after the accepted suggestion
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPos = cursorPosition + suggestion.text.length;
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
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
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("click", handleSelectionChange);
      textarea.addEventListener("keyup", handleSelectionChange);

      return () => {
        textarea.removeEventListener("click", handleSelectionChange);
        textarea.removeEventListener("keyup", handleSelectionChange);
      };
    }
  }, []);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />

      {/* Autocomplete Suggestion Overlay */}
      {showSuggestion && (suggestion.isLoading || suggestion.text) && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-lg">
            {suggestion.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">Pensando...</span>
              </>
            ) : suggestion.text ? (
              <>
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="max-w-48 truncate text-sm text-gray-700">
                  {suggestion.text}
                </span>
                <div className="ml-2 text-xs text-gray-500">Tab ↹</div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Floating suggestion preview */}
      {showSuggestion && suggestion.text && !suggestion.isLoading && (
        <div className="absolute right-2 bottom-2 left-2 z-10">
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">
                  <strong>Sugestão:</strong> {suggestion.text}
                </span>
              </div>
              <div className="text-xs text-blue-600">
                Pressione Tab ou → para aceitar • Esc para dispensar
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
