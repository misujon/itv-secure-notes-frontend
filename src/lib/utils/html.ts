export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function stripHtml(value?: string | null): string {
  if (!value) {
    return "";
  }
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeEditorContent(raw?: string | null): string {
  if (!raw || !raw.trim()) {
    return "";
  }
  if (looksLikeHtml(raw)) {
    return raw;
  }
  return raw
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
