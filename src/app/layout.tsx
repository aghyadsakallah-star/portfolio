
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
 
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export const metadata: Metadata = {
  title: "Aghyad Sakallah — Creative Video Ads & Cinematic Content",
  description:
    "Cinematic visuals engineered for engagement & conversions. Scroll-stopping video ads built for modern brands.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Aghyad Sakallah — Creative Video Ads & Cinematic Content",
    description:
      "Cinematic visuals engineered for engagement & conversions. Scroll-stopping video ads built for modern brands.",
    images: ["/favicon.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aghyad Sakallah — Creative Video Ads & Cinematic Content",
    description:
      "Cinematic visuals engineered for engagement & conversions. Scroll-stopping video ads built for modern brands.",
    images: ["/favicon.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
 