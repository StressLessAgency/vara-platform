import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { Cursor } from "@/components/motion/Cursor";
import { OpeningCeremony } from "@/components/motion/OpeningCeremony";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VARA",
  description: "VARA Resident Platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OpeningCeremony />
        <AmbientBackdrop />
        <Cursor />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
