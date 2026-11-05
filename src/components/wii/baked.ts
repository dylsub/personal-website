// The Wii shows copies of the site's images with its CRT softening baked in
// (scripts/bake-wii.mjs), so the screen needs no live filters.

/** The baked copy of an image under /public. */
export const baked = (src: string) => `/wii${src.replace(/\.\w+$/, ".webp")}`;

/** A tiny, blurred and dimmed copy, stretched as a channel's backdrop. */
export const backdrop = (src: string) =>
  `/wii${src.replace(/\.\w+$/, "-backdrop.webp")}`;
