import "@/styles/globals.css";

import { ThemeSwitcherButton } from "@/components/ui/ThemeSwitcherButton";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "FinTrack",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html id="Root" lang="en" className="dark">
      <head />
      <body className={`antialized min-h-screen font-sans ${inter.variable}`}>
        <Providers>
          <ThemeSwitcherButton className="absolute right-4 top-4" />
          {children}
        </Providers>
      </body>
    </html>
  );
}

type LayoutProps = { children: Readonly<ReactNode> };
