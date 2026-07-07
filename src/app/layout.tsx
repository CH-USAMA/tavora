import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tavora — Luxury Watches",
  description:
    "Discover timeless elegance with Tavora's curated collection of premium luxury watches. Crafted for those who appreciate the finer things.",
  keywords: ["luxury watches", "premium timepieces", "Tavora", "designer watches"],
  openGraph: {
    title: "Tavora — Luxury Watches",
    description:
      "Discover timeless elegance with Tavora's curated collection of premium luxury watches.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
