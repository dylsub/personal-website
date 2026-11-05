import {
  Archivo,
  Bricolage_Grotesque,
  Courier_Prime,
  DM_Mono,
  Fraunces,
  IBM_Plex_Mono,
  Libre_Franklin,
  Nunito,
  Old_Standard_TT,
  Pixelify_Sans,
  Space_Mono,
  Young_Serif,
} from "next/font/google";

// Only the live pairing (ACTIVE_COMBO in content/font-combos) is preloaded;
// the rest load on demand when the switcher picks them.

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  preload: false,
});
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  preload: false,
});
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  preload: false,
});

const oldStandard = Old_Standard_TT({
  variable: "--font-old-standard",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});
const franklin = Libre_Franklin({
  variable: "--font-franklin",
  subsets: ["latin"],
  preload: false,
});

// The iPod's LCD stays pixelated whatever the pairing.
const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

// Rounded UI face for the Wii screen and remote.
const rounded = Nunito({
  variable: "--font-rounded",
  subsets: ["latin"],
});

export const fontVariables = [
  fraunces,
  plexMono,
  youngSerif,
  courier,
  archivo,
  spaceMono,
  bricolage,
  dmMono,
  oldStandard,
  franklin,
  pixel,
  rounded,
]
  .map((font) => font.variable)
  .join(" ");
