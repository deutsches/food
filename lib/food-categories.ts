export const defaultCategories = ['披薩', '燒肉', '咖啡店', '漢堡'];
export function normalizeCategory(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFKC').trim().replace(/\s+/g, ' ');
  return name.length > 0 && name.length <= 30 && !/[\u0000-\u001f\u007f]/.test(name) ? name : null;
}
export function mapsLink(name: string, area: string) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`日本 東京 ${area} ${name}`);
}
