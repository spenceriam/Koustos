export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function parseRepo(input: string): { owner: string; name: string } | null {
  const match = input.trim().match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

export function clampLength(text: string, max = 4000): string {
  if (text.length <= max) return text;
  return text.slice(0, max);
}


