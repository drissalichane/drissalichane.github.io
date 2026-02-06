import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import TapCounter from "@/components/TapCounter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alichane Driss | Software Engineer",
  description: "Portfolio of Alichane Driss, a Full-Stack & AI Software Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <TapCounter />
        <Analytics />
      </body>
    </html>
  );
}
