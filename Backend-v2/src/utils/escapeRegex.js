/** Escapes regex metacharacters so user text can be used inside a RegExp literally. */
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
