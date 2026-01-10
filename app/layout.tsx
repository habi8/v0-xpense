import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XPENSE",
  description: "Created for daily use",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/xpense.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/xpense.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/xpense.png",
        type: "image/png+xml",
      },
    ],
    apple: "/xpense.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
