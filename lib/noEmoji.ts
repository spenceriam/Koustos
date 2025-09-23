export function removeEmojis(input: string): string {
  // Remove broad emoji and pictographic ranges
  return input.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "");
}


