/**
 * Slug utilities for URL-safe identifiers.
 * Used by school directory for country/city/school URL segments.
 */

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function deslugify(slug) {
  if (!slug) return '';
  return slug.replace(/-/g, ' ');
}

export function capitalizeWords(text) {
  if (!text) return '';
  return text.replace(/\b\w/g, c => c.toUpperCase());
}

export function deslugifyDisplay(slug) {
  return capitalizeWords(deslugify(slug));
}
