import { Archivo, Nunito, Pixelify_Sans, Space_Mono } from "next/font/google";

// Headlines (expanded) and body text.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Dates and small print.
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// The iPod's LCD stays pixelated.
const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

// Rounded UI face for the Wii screen and remote.
const rounded = Nunito({
  variable: "--font-rounded",
  subsets: ["latin"],
});

export const fontVariables = [archivo, spaceMono, pixel, rounded]
  .map((font) => font.variable)
  .join(" ");
