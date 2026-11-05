// Colours each binder card after the most common colour in its art, and
// works out text colours that stay readable on it. Writes
// src/content/card-colors.json, keyed by art path. Rerun after changing art:
//   node scripts/card-colors.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const DARK_INK = [29, 27, 22];
const LIGHT_INK = [251, 246, 232];

const hex = (rgb) =>
  "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);

// WCAG relative luminance and contrast ratio.
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Whichever ink reads better on a background. */
const inkFor = (bg) =>
  contrast(DARK_INK, bg) >= contrast(LIGHT_INK, bg) ? DARK_INK : LIGHT_INK;

/** How colourful a pixel is, 0 (grey, white or black) to 1. */
const chroma = (r, g, b) => (Math.max(r, g, b) - Math.min(r, g, b)) / 255;

/**
 * The most common colour: the picture at 64px, each channel cut to 16
 * levels so near-identical shades count together, and the busiest bucket's
 * pixels averaged back into one colour. Screenshots are often mostly white
 * page, so if at least a tenth of the picture is actual colour, the busiest
 * colourful bucket wins instead.
 */
async function dominant(file) {
  const { data } = await sharp(file)
    .resize(64, 64, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const all = new Map();
  const colourful = new Map();
  let colourfulCount = 0;
  const add = (map, key, r, g, b) => {
    const k = map.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    k.n++;
    k.r += r;
    k.g += g;
    k.b += b;
    map.set(key, k);
  };
  for (let i = 0; i < data.length; i += 3) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const key = (r >> 4) * 256 + (g >> 4) * 16 + (b >> 4);
    add(all, key, r, g, b);
    if (chroma(r, g, b) > 0.25) {
      add(colourful, key, r, g, b);
      colourfulCount++;
    }
  }
  const pixels = data.length / 3;
  const pool = colourfulCount / pixels >= 0.1 ? colourful : all;
  const top = [...pool.values()].sort((a, b) => b.n - a.n)[0];
  return [top.r / top.n, top.g / top.n, top.b / top.n];
}

function palette(color) {
  // The face carries the text, so it's a light tint; if the colour is so
  // light the tint is near white anyway, that's fine.
  const face = mix(color, [255, 255, 255], 0.78);
  // The frame is the colour itself, darkened until it stands apart from
  // the face, which matters when the art is mostly white.
  let frame = color;
  for (let t = 0.1; contrast(frame, face) < 1.6 && t <= 0.6; t += 0.1)
    frame = mix(color, [0, 0, 0], t);
  // The strip under the art is a mid-tone, where neither ink may reach
  // 4.5:1; lighten it until one does.
  let strip = mix(color, [255, 255, 255], 0.45);
  for (let t = 0.5; contrast(inkFor(strip), strip) < 4.5 && t < 1; t += 0.05)
    strip = mix(color, [255, 255, 255], t);
  let ink = inkFor(face);
  // Body text needs 4.5:1; if neither ink gets there, lighten the face.
  let f = face;
  for (let t = 0.82; contrast(ink, f) < 4.5 && t < 1; t += 0.04) {
    f = mix(color, [255, 255, 255], t);
    ink = inkFor(f);
  }
  return {
    frame: hex(frame),
    frameDeep: hex(mix(frame, [0, 0, 0], 0.25)),
    frameLight: hex(mix(frame, [255, 255, 255], 0.25)),
    face: hex(f),
    faceDeep: hex(mix(f, color, 0.25)),
    ink: hex(ink),
    strip: hex(strip),
    stripInk: hex(inkFor(strip)),
    contrast: Number(contrast(ink, f).toFixed(2)),
  };
}

const source = await readFile(
  path.join(ROOT, "src", "content", "projects.ts"),
  "utf8",
);
const arts = [...source.matchAll(/art: "([^"]+)"/g)].map((m) => m[1]);
const colors = {};
for (const art of arts) {
  const color = await dominant(path.join(ROOT, "public", art));
  colors[art] = { dominant: hex(color), ...palette(color) };
}
await writeFile(
  path.join(ROOT, "src", "content", "card-colors.json"),
  JSON.stringify(colors, null, 2) + "\n",
);
for (const [art, c] of Object.entries(colors))
  console.log(
    `${art}: ${c.dominant} → frame ${c.frame}, face ${c.face}, text ${c.contrast}:1`,
  );
