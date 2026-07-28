export function truncateText(
  input: string | null | undefined,
  max: number
): string {
  if (!input) return "";
  if (max <= 0) return "";

  const text = input.trim();

  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max).trimEnd()}...`;
}