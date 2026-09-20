export const countryDefaultCategories = {
  台灣: ['拉麵', '漢堡'],
  日本: ['披薩', '燒肉', '咖啡店', '漢堡'],
} as const;
export const defaultCategories: string[] = [...new Set<string>(Object.values(countryDefaultCategories).flat())];
export function normalizeCategory(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFKC').trim().replace(/\s+/g, ' ');
  return name.length > 0 && name.length <= 30 && !/[\u0000-\u001f\u007f]/.test(name) ? name : null;
}
export function mapsLink(name: string, area: string, country = '日本') {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${country} ${area} ${name}`.trim());
}
