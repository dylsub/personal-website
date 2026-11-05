// Bakes the Wii screen's CRT look into image files, so the page draws plain
// images instead of running blur filters, blend modes or gradient overlays.
// Rerun after adding or changing a game or favourite image:
//   node scripts/bake-wii.mjs
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(import.meta.dirname, "..", "public");
const OUT = path.join(PUBLIC, "wii");

// The old live filter: a slight blur, a touch more contrast and saturation.
const crt = (image, sigma) =>
  image
    .blur(sigma)
    .linear(1.04, -128 * 0.04)
    .modulate({ saturation: 1.06 });

async function bakeGames() {
  const games = await readdir(path.join(PUBLIC, "games"));
  for (const game of games) {
    const dir = path.join(PUBLIC, "games", game);
    const files = (await readdir(dir)).filter((f) =>
      /^(cover|shot-\d+)\.(png|jpe?g)$/.test(f),
    );
    await mkdir(path.join(OUT, "games", game), { recursive: true });
    for (const file of files) {
      // Pixel art: scale up with hard edges first, so the blur softens the
      // pixels the way a TV would rather than smearing a tiny source.
      const out = path.join(
        OUT,
        "games",
        game,
        file.replace(/\.\w+$/, ".webp"),
      );
      await crt(
        sharp(path.join(dir, file)).resize({ width: 1280, kernel: "nearest" }),
        0.7,
      )
        .webp({ quality: 82 })
        .toFile(out);
    }
  }
}

async function bakeFavorites() {
  const dir = path.join(PUBLIC, "favorites");
  await mkdir(path.join(OUT, "favorites"), { recursive: true });
  for (const file of await readdir(dir)) {
    const name = file.replace(/\.\w+$/, "");
    await crt(sharp(path.join(dir, file)).resize({ width: 400 }), 0.5)
      .webp({ quality: 82 })
      .toFile(path.join(OUT, "favorites", `${name}.webp`));
    // The channel's backdrop: tiny, heavily blurred and dimmed. Stretched to
    // fill the screen it reads as a soft wash of the cover's colours.
    await sharp(path.join(dir, file))
      .resize({ width: 48 })
      .blur(3)
      .modulate({ brightness: 0.55 })
      .webp({ quality: 70 })
      .toFile(path.join(OUT, "favorites", `${name}-backdrop.webp`));
  }
}

// The glass over the picture, in three small images the overlay stacks:
// grain and scanlines as repeating tiles, and a smooth low-resolution layer
// for the tube darkening toward its edges and the glare high on the left.
async function bakeGlass() {
  const W = 320;
  const H = 240;
  const glow = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const edge = Math.hypot((x / W - 0.5) / 0.425, (y / H - 0.5) / 0.425);
      const glare = Math.hypot((x / W - 0.28) / 0.3, (y / H - 0.18) / 0.225);
      if (edge > 0.62) {
        glow.set([20, 28, 36], i);
        glow[i + 3] = Math.min((edge - 0.62) / 0.38, 1) * 0.22 * 255;
      } else if (glare < 0.7) {
        glow.set([255, 255, 255], i);
        glow[i + 3] = (1 - glare / 0.7) * 0.1 * 255;
      }
    }
  }
  await sharp(glow, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(path.join(OUT, "glass.webp"));

  // One scanline period: dark for its first 35%, as a 1×16 tile.
  const line = Buffer.alloc(16 * 4);
  for (let y = 0; y < 6; y++) line[y * 4 + 3] = 0.07 * 255;
  await sharp(line, { raw: { width: 1, height: 16, channels: 4 } })
    .png()
    .toFile(path.join(OUT, "scanline.png"));

  const N = 128;
  const grain = Buffer.alloc(N * N * 4);
  for (let i = 0; i < grain.length; i += 4) {
    grain.fill(Math.random() * 255, i, i + 3);
    grain[i + 3] = 0.05 * 255;
  }
  await sharp(grain, { raw: { width: N, height: N, channels: 4 } })
    .png({ palette: true, colours: 64 })
    .toFile(path.join(OUT, "grain.png"));
}

// The faint ruled lines behind the menu: one light-grey line per tile.
async function bakeStripes() {
  const line = [0xe3, 0xe7, 0xea];
  const bg = [0xee, 0xf1, 0xf3];
  const rows = [line, ...Array(8).fill(bg)];
  await sharp(Buffer.from(rows.flat()), {
    raw: { width: 1, height: rows.length, channels: 3 },
  })
    .png()
    .toFile(path.join(OUT, "stripes.png"));
}

await mkdir(OUT, { recursive: true });
await Promise.all([bakeGames(), bakeFavorites(), bakeGlass(), bakeStripes()]);
console.log("Baked the Wii images into public/wii");
