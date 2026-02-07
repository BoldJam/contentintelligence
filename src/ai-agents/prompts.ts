/**
 * Central place for all AI prompt templates.
 */

export function generateTitlePrompt(url: string): string {
  return `Given the following URL, generate a concise, descriptive title for the content it points to. The title should be human-readable, properly capitalized, and no longer than 80 characters. Return ONLY the title text with no quotes, no explanation, and no extra formatting.

URL: ${url}`;
}
