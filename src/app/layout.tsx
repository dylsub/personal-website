import type { Metadata } from "next";
import { site } from "@/content/site";
import { fontVariables } from "./fonts";
import "./globals.css";

// The tab and search-result title: just the handle
const title = site.handle;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  applicationName: site.handle,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [site.name, site.handle, "dunker", "game developer"],
  // dylsub.me redirects here; this is the one address to index
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    firstName: "Dylan",
    lastName: "Subramanian",
    username: site.handle,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
