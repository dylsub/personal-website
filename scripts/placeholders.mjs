// Writes a tiny blurred stand-in for each image the page shows, inlined as
// data URLs in src/content/placeholders.json. They paint at once while the
// full images load. Rerun after adding or changing an image (after
// bake-wii.mjs, whose output it reads):
//   node scripts/placeholders.mjs
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const WIDTH = 16;

async function files(dir, test) {
  const entries = await readdir(path.join(PUBLIC, dir), {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((e) => e.isFile() && test(e.name))
    .map((e) =>
      path.posix.join(
        "/",
        path.relative(PUBLIC, path.join(e.parentPath, e.name)),
      ),
    );
}

// The tiny image, softened by an SVG blur so it reads as out of focus rather
// than blocky. It overshoots by a pixel each side so the blur has no faded rim.
async function placeholder(src) {
  const { data, info } = await sharp(path.join(PUBLIC, src))
    .resize({ width: WIDTH })
    .webp({ quality: 50 })
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const href = `data:image/webp;base64,${data.toString("base64")}`;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'>` +
    `<filter id='b'><feGaussianBlur stdDeviation='0.8'/></filter>` +
    `<image x='-1' y='-1' width='${w + 2}' height='${h + 2}' preserveAspectRatio='none' href='${href}' filter='url(#b)'/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const sources = [
  ...(await files("wii/games", (n) => n.endsWith(".webp"))),
  ...(await files(
    "wii/favorites",
    (n) => n.endsWith(".webp") && !n.includes("-backdrop"),
  )),
  ...(await files("videos", (n) => n.endsWith(".jpg"))),
].sort();

const map = Object.fromEntries(
  await Promise.all(sources.map(async (src) => [src, await placeholder(src)])),
);
await writeFile(
  path.join(ROOT, "src", "content", "placeholders.json"),
  JSON.stringify(map, null, 2) + "\n",
);
console.log(`Wrote ${sources.length} placeholders`);
