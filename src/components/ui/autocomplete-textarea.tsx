"use client";

import React, { useEffect, useRef, useState } from "react";

import { Lightbulb, Loader2 } from "lucide-react";

import { useAutocomplete } from "@/hooks/useAutocomplete";

import { Textarea } from "./textarea";

// Helper function to calculate text dimensions
const getTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    return context.measureText(text).width;
  }
  return 0;
};

interface AutocompleteTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enableAutocomplete?: boolean;
  minCharsForSuggestion?: number;
}

interface GhostTextPosition {
  top: number;
  left: number;
  lineHeight: number;
}

export function AutocompleteTextarea({
  value,
  onChange,
  enableAutocomplete = true,
  minCharsForSuggestion = 2,
  className,
  ...props
}: AutocompleteTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [ghostTextPosition, setGhostTextPosition] =
    useState<GhostTextPosition | null>(null);

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

  // Calculate cursor position for ghost text
  const calculateGhostTextPosition = (): GhostTextPosition | null => {
    if (!textareaRef.current) return null;

    const textarea = textareaRef.current;
    const textBeforeCursor = value.slice(0, cursorPosition);

    // Create a temporary div to calculate text position
    const tempDiv = document.createElement("div");
    const computedStyle = window.getComputedStyle(textarea);

    // Copy styles
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.whiteSpace = "pre-wrap";
    tempDiv.style.wordWrap = "break-word";
    tempDiv.style.font = computedStyle.font;
    tempDiv.style.fontSize = computedStyle.fontSize;
    tempDiv.style.fontFamily = computedStyle.fontFamily;
    tempDiv.style.lineHeight = computedStyle.lineHeight;
    tempDiv.style.padding = computedStyle.padding;
    tempDiv.style.border = computedStyle.border;
    tempDiv.style.width = `${textarea.clientWidth}px`;

    document.body.appendChild(tempDiv);

    // Add text before cursor
    tempDiv.textContent = textBeforeCursor;

    // Add span to measure cursor position
    const cursorSpan = document.createElement("span");
    cursorSpan.textContent = "|";
    tempDiv.appendChild(cursorSpan);

    const spanRect = cursorSpan.getBoundingClientRect();
    const tempDivRect = tempDiv.getBoundingClientRect();

    const lineHeight = parseInt(computedStyle.lineHeight) || 20;

    document.body.removeChild(tempDiv);

    return {
      top: spanRect.top - tempDivRect.top,
      left: spanRect.left - tempDivRect.left,
      lineHeight,
    };
  };

  // Track cursor position
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const newPosition = textareaRef.current.selectionStart || 0;
      setCursorPosition(newPosition);

      if (showSuggestion && suggestion.text && !suggestion.isLoading) {
        const position = calculateGhostTextPosition();
        setGhostTextPosition(position);
      }
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
    const textBeforeCursor = value.slice(0, cursorPosition);
    const words = textBeforeCursor.toLowerCase().split(/\s+/);
    const lastWord = words[words.length - 1];

    if (lastWord && clean.toLowerCase().startsWith(lastWord)) {
      clean = clean.slice(lastWord.length);
    }

    return clean;
  };

  // Update ghost text position when suggestion changes
  useEffect(() => {
    if (showSuggestion && suggestion.text && !suggestion.isLoading) {
      const position = calculateGhostTextPosition();
      setGhostTextPosition(position);
    } else {
      setGhostTextPosition(null);
    }
  }, [
    showSuggestion,
    suggestion.text,
    suggestion.isLoading,
    cursorPosition,
    value,
  ]);

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

      {/* Ghost Text Overlay */}
      {ghostTextPosition &&
        showSuggestion &&
        suggestion.text &&
        !suggestion.isLoading && (
          <div
            className="pointer-events-none absolute z-10 text-gray-400"
            style={{
              top: `${ghostTextPosition.top}px`,
              left: `${ghostTextPosition.left}px`,
              fontSize: "inherit",
              fontFamily: "inherit",
              lineHeight: `${ghostTextPosition.lineHeight}px`,
            }}
          >
            {getCleanSuggestion(suggestion.text)}
          </div>
        )}

      {/* Loading indicator when thinking */}
      {showSuggestion && suggestion.isLoading && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">Pensando...</span>
          </div>
        </div>
      )}

      {/* Hint for tab completion */}
      {showSuggestion && suggestion.text && !suggestion.isLoading && (
        <div className="absolute right-2 bottom-2 z-10">
          <div className="flex items-center gap-1 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-75">
            <span>Tab para completar</span>
          </div>
        </div>
      )}
    </div>
  );
}
