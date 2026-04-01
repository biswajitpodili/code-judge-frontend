/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// Import language support
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
// Import plugins
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import { useProblem } from "../context/ProblemContext";

export type SupportedLanguage = "c" | "cpp" | "java" | "py" | "js";

interface CodeEditorProps {
  initialCode?: string;
  language?: SupportedLanguage;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  c: ``,
  cpp: ``,
  java: ``,
  py: ``,
  js: ``,
};

// Language labels for the sidebar
// eslint-disable-next-line react-refresh/only-export-components
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  c: "C",
  cpp: "C++",
  java: "Java",
  py: "Python",
  js: "JavaScript",
};

const FILE_EXTENSIONS: Record<SupportedLanguage, string> = {
  c: ".c",
  cpp: ".cpp",
  java: ".java",
  py: ".py",
  js: ".js",
};

const getIndentation = (line: string): string => {
  const match = line.match(/^[ \t]*/);
  return match ? match[0] : "";
};

const getCurrentLineIndentation = (
  code: string,
  position: number,
  language: SupportedLanguage
): string => {
  const lines = code.substring(0, position).split("\n");
  const currentLine = lines[lines.length - 1] || "";
  const baseIndentation = getIndentation(currentLine);

  // Check if the character before cursor is a curly brace
  const prevChar = code.charAt(position - 1);
  if (prevChar === "{") {
    return baseIndentation + (language === "py" ? "    " : "  ");
  }

  return baseIndentation;
};

export const CodeEditor = ({
  initialCode,
  language = "js",
  onChange,
  readOnly = false,
}: CodeEditorProps) => {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeProblem } = useProblem();

  // Only set initial code once when the component mounts or language changes
  useEffect(() => {
    setCode((prevCode) => prevCode || initialCode || DEFAULT_CODE[language]);
  }, [language, initialCode]);

  useEffect(() => {
    if (activeProblem?.defaultCode) {
      //@ts-expect-error
      setCode(activeProblem.defaultCode[language]);
    }
  }, [activeProblem, language]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // Auto scroll on mount and code change
  useEffect(() => {
    scrollToBottom();
  }, [code, scrollToBottom]);

  const handleValueChange = (newCode: string) => {
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    // Handle Tab key
    if (e.key === "Tab") {
      e.preventDefault();
      const indentation = language === "py" ? "    " : "  ";
      const newCode =
        value.substring(0, selectionStart) +
        indentation +
        value.substring(selectionEnd);
      handleValueChange(newCode);

      // Move cursor after indentation
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + indentation.length;
      }, 0);
    }

    // Handle Enter key
    if (e.key === "Enter") {
      e.preventDefault();
      const currentIndentation = getCurrentLineIndentation(
        value,
        selectionStart,
        language
      );
      const prevChar = value.charAt(selectionStart - 1);
      const nextChar = value.charAt(selectionStart);

      let newCode;
      if (prevChar === "{" && nextChar === "}") {
        // If we're between curly braces, add an extra line with proper indentation
        const baseIndent = getIndentation(
          value.substring(0, selectionStart).split("\n").pop() || ""
        );
        newCode =
          value.substring(0, selectionStart) +
          "\n" +
          currentIndentation +
          "\n" +
          baseIndent +
          value.substring(selectionEnd);

        // Position cursor on the indented line
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            selectionStart + 1 + currentIndentation.length;
        }, 0);
      } else {
        newCode =
          value.substring(0, selectionStart) +
          "\n" +
          currentIndentation +
          value.substring(selectionEnd);

        // Move cursor after indentation
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            selectionStart + 1 + currentIndentation.length;
        }, 0);
      }

      handleValueChange(newCode);
    }

    // Handle closing brackets
    const closingBrackets: Record<string, string> = {
      "{": "}",
      "[": "]",
      "(": ")",
      "}": "}",
      "]": "]",
      ")": ")",
    };

    if (closingBrackets[e.key]) {
      // If it's a closing bracket and the next character is already that bracket, just move the cursor
      if (
        ["}", "]", ")"].includes(e.key) &&
        value.charAt(selectionStart) === e.key
      ) {
        e.preventDefault();
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        }, 0);
        return;
      }

      // If it's an opening bracket, add both opening and closing
      if (["{", "[", "("].includes(e.key)) {
        e.preventDefault();
        const newCode =
          value.substring(0, selectionStart) +
          e.key +
          closingBrackets[e.key] +
          value.substring(selectionEnd);

        handleValueChange(newCode);

        // Move cursor between brackets
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        }, 0);
      }
    }
  };

  const highlightCode = (code: string) => {
    return Prism.highlight(code, Prism.languages[language], language);
  };

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${FILE_EXTENSIONS[language]}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [code, language]);

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="relative overflow-hidden border border-[#3d3d3d] bg-[#282828]">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#282828] border-b border-[#3d3d3d]">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-gray-200 font-[var(--font-source-code)]">
            {LANGUAGE_LABELS[language]}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-[#6d6d6d] rounded"
            title="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadCode}
            className="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-[#6d6d6d] rounded"
            title="Download code"
          >
            Download
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        ref={containerRef}
        className="flex min-h-[350px] max-h-[350px] overflow-auto"
      >
        {/* Line Numbers */}
        <div className="line-numbers-container py-4 pr-4 pl-3 text-right bg-[#1e1e1e] border-r border-[#3d3d3d] w-10 min-h-[350px] h-full">
          {lineNumbers.map((num) => (
            <div
              key={num}
              className="line-number text-gray-500 select-none"
              style={{ lineHeight: "1.4" }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <Editor
            value={code}
            onValueChange={handleValueChange}
            // @ts-expect-error - Editor component from react-simple-code-editor has incorrect type definitions for onKeyDown
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
              handleKeyDown(e)
            }
            highlight={highlightCode}
            padding={16}
            readOnly={readOnly}
            id="code-editor"
            style={{
              fontFamily: "Source Code Pro Medium",
              fontSize: "14px",
              lineHeight: "1.6",
              minHeight: "350px",
              letterSpacing: "0.05em",
              background: "#282828",
            }}
            textareaClassName="focus:outline-none"
            className="code-editor"
          />
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#282828] border-t border-[#3d3d3d]">
        <span className="text-xs text-gray-400">{lineCount} lines</span>
        <span className="text-xs text-gray-400">{code.length} characters</span>
      </div>
    </div>
  );
};
