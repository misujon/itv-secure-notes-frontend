"use client";

import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";
import { looksLikeHtml } from "@/lib/utils/html";

interface RichTextContentProps {
  content: string;
  className?: string;
}

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "u",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "hr",
];

export function RichTextContent({ content, className }: RichTextContentProps) {
  if (!looksLikeHtml(content)) {
    return (
      <div
        className={cn(
          "text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-wrap break-words",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [],
  });

  return (
    <div
      className={cn(
        "rich-text-content text-sm sm:text-base leading-relaxed text-foreground break-words",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
