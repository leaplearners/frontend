"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathPreviewProps {
  content: string;
  className?: string;
  renderMarkdown?: boolean;
  katexOptions?: katex.KatexOptions;
}

type MathToken = {
  placeholder: string;
  html: string;
};

/**
 * Correct answers are often stored as bare TeX (e.g. `\frac{1}{2}`) without
 * `$...$` delimiters. Feedback/prose usually already includes delimiters.
 * Wrap only when the string (or ` or `-separated parts) looks like a pure
 * expression — not English sentences that happen to contain a command.
 */
function isBareLatexExpression(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/\$|\\\(|\\\[/.test(trimmed)) return false;
  if (!/\\[a-zA-Z]+/.test(trimmed)) return false;

  const leftover = trimmed
    .replace(/\\[a-zA-Z]+\*?/g, "")
    .replace(/[{}]/g, " ")
    .replace(/[0-9+\-*/^=_(),.[\]\s\\]/g, "")
    .trim();

  // Leftover letter runs ⇒ prose, not a pure math expression
  if (/[a-zA-Z]{3,}/.test(leftover)) return false;
  return true;
}

function wrapBareLatexExpressions(content: string): string {
  // Split joined correct answers: "\frac{1}{2} or \frac{2}{4}"
  return content
    .split(/(\s+or\s+)/i)
    .map((part) => {
      if (/^\s+or\s+$/i.test(part)) return part;
      if (!isBareLatexExpression(part)) return part;
      const trimmed = part.trim();
      return part.replace(trimmed, `$${trimmed}$`);
    })
    .join("");
}

/**
 * Extract math segments first so markdown (e.g. *italic*) cannot corrupt
 * LaTeX that contains asterisks or other markdown-significant characters.
 * Supports $...$, $$...$$, \(...\), and \[...\].
 */
function extractAndRenderMath(
  content: string,
  renderLatexToHtml: (math: string, displayMode: boolean) => string,
): { text: string; tokens: MathToken[] } {
  const tokens: MathToken[] = [];
  let text = content;
  let tokenIndex = 0;

  const stash = (math: string, displayMode: boolean) => {
    const placeholder = `\u0000MATH${tokenIndex++}\u0000`;
    tokens.push({
      placeholder,
      html: displayMode
        ? `<div class="my-4" data-testid="math-block">${renderLatexToHtml(math, true)}</div>`
        : `<span data-testid="math-inline">${renderLatexToHtml(math, false)}</span>`,
    });
    return placeholder;
  };

  // Block math first ($$...$$ and \[...\])
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math: string) =>
    stash(math, true),
  );
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math: string) =>
    stash(math, true),
  );

  // Inline math ($...$ and \(...\)) — avoid matching lone $ that start $$
  text = text.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (_, math: string) =>
    stash(math, false),
  );
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math: string) =>
    stash(math, false),
  );

  return { text, tokens };
}

function applyMarkdown(text: string): string {
  let processed = text;
  processed = processed.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  processed = processed.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  processed = processed.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-bold">$1</strong>',
  );
  processed = processed.replace(
    /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
    "<em>$1</em>",
  );
  return processed;
}

function restoreMathTokens(text: string, tokens: MathToken[]): string {
  let result = text;
  for (const token of tokens) {
    result = result.split(token.placeholder).join(token.html);
  }
  return result;
}

export function MathPreview({
  content,
  className = "",
  renderMarkdown = false,
  katexOptions = {},
}: MathPreviewProps) {
  const renderedContent = useMemo(() => {
    if (!content) return null;

    const renderLatexToHtml = (math: string, displayMode: boolean) => {
      try {
        return katex.renderToString(math, {
          throwOnError: false,
          displayMode,
          ...katexOptions,
        });
      } catch (error) {
        return `<span data-testid="math-error" class="text-red-500">LaTeX Error: ${error instanceof Error ? error.message : "Unknown error"}</span>`;
      }
    };

    // Preserve escaped dollars as literal $
    let processedContent = content.replace(
      /\\\$/g,
      "\u0000ESCAPED_DOLLAR\u0000",
    );

    // Bare TeX answers like `\frac{1}{2}` → `$\frac{1}{2}$` so KaTeX runs
    processedContent = wrapBareLatexExpressions(processedContent);

    const { text, tokens } = extractAndRenderMath(
      processedContent,
      renderLatexToHtml,
    );

    let htmlContent = renderMarkdown ? applyMarkdown(text) : text;
    htmlContent = restoreMathTokens(htmlContent, tokens);
    htmlContent = htmlContent.replace(/\u0000ESCAPED_DOLLAR\u0000/g, "$");

    if (renderMarkdown) {
      htmlContent = htmlContent.replace(/(?<!\n)\n(?!\n)/g, "<br>");
      const lines = htmlContent.split("\n\n");
      htmlContent = lines
        .map((line) => {
          line = line.trim();
          if (!line) return "";
          if (line.startsWith("<h") || line.startsWith("<div")) {
            return line;
          }
          return `<p>${line}</p>`;
        })
        .join("");
    }

    return htmlContent;
  }, [content, katexOptions, renderMarkdown]);

  if (!renderedContent) {
    return <div data-testid="math-preview-container" className={className} />;
  }

  const containerClass = renderMarkdown
    ? `prose prose-sm max-w-none ${className}`
    : className;

  return (
    <div
      data-testid="math-preview-container"
      className={containerClass}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}
