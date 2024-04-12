export function capitalizeFirstLetter(s: string): string {
  if (s.length === 0) return s; // or return "" for an empty string
  return s.charAt(0).toUpperCase() + s.slice(1);
}
