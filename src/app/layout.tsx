import type { Metadata } from "next";
import { FontSwitcher } from "@/components/font-switcher";
import { ACTIVE_COMBO } from "@/content/font-combos";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dylan Subramanian",
  description: "Personal website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-fonts={ACTIVE_COMBO}
      className={`${fontVariables} antialiased`}
    >
      <body>
        {children}
        <FontSwitcher />
      </body>
    </html>
  );
}
