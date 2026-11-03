import type { Metadata } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dylan Subramanian",
  description: "Personal website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable} ${pixel.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
