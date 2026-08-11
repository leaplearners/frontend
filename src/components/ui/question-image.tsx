"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  getQuestionImageStyles,
  getQuestionImageContainerStyles,
  type QuestionImageProps,
} from "@/lib/image-utils";

/**
 * Standardized component for rendering question images consistently across the app.
 * Handles loading, a single retry on failure, and remounts when `src` changes.
 */
export function QuestionImage({
  src,
  alt = "Question illustration",
  metadata,
  className = "rounded-lg border shadow-sm",
  defaultMaxHeight = "600px",
}: QuestionImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [retryCount, setRetryCount] = useState(0);
  // Bust cache on retry so a transient CDN/network failure can recover
  const displaySrc =
    retryCount > 0
      ? `${src}${src.includes("?") ? "&" : "?"}retry=${retryCount}`
      : src;

  useEffect(() => {
    setStatus("loading");
    setRetryCount(0);
  }, [src]);

  const handleLoad = useCallback(() => {
    setStatus("loaded");
  }, []);

  const handleError = useCallback(() => {
    if (retryCount < 1) {
      setRetryCount(1);
      setStatus("loading");
      return;
    }
    console.error("Failed to load question image:", src);
    setStatus("error");
  }, [retryCount, src]);

  if (!src) return null;

  return (
    <div className="mt-4" style={getQuestionImageContainerStyles(metadata)}>
      {status === "loading" && (
        <div
          className="w-full max-w-md rounded-lg border bg-muted/40 animate-pulse"
          style={{ height: 160 }}
          aria-hidden
        />
      )}

      {status === "error" ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Image could not be loaded
        </div>
      ) : (
        <img
          key={`${src}-${retryCount}`}
          src={displaySrc}
          alt={alt}
          className={className}
          style={{
            ...getQuestionImageStyles(metadata, defaultMaxHeight),
            display: status === "loaded" ? undefined : "none",
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
