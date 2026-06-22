/**
 * Generates a URL-friendly slug from an arbitrary label.
 * Strips accents, lowercases, and collapses non-alphanumerics into hyphens.
 */
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(value: string): string {
	return value
		.normalize("NFD")
		.replace(COMBINING_MARKS, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
