import type { Metadata } from "next";
import { Big_Shoulders, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
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
      className={`${display.variable} ${pixel.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
