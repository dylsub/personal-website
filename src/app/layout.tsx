import type { Metadata } from "next";
import { Nunito, Pixelify_Sans, Tiny5 } from "next/font/google";
import "./globals.css";

const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

// Pixelify's 5 reads like an 8, so dates use Tiny5's clearer digits.
const numeric = Tiny5({
  variable: "--font-numeric",
  subsets: ["latin"],
  weight: "400",
});

// Rounded UI face for the Wii screen and remote.
const rounded = Nunito({
  variable: "--font-rounded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dylan Subramanian",
  description: "Personal website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixel.variable} ${numeric.variable} ${rounded.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
