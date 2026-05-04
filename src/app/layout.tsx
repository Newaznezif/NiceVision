import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {

    default: "Nice Vision | Professional Photography by Kim Gérard",
    template: "%s | Nice Vision",
  },
  description: "Capturing timeless stories through the lens. Professional photography studio in Burundi specializing in Wedding, Portrait, Fashion, and Commercial photography.",
  keywords: ["Photography", "Burundi", "Wedding Photography", "Portrait", "Kim Gérard", "Nice Vision"],
  authors: [{ name: "Kim Gérard" }],
  creator: "Kim Gérard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nicevision.com",
    siteName: "Nice Vision",
    title: "Nice Vision | Professional Photography",
    description: "Capturing timeless stories through the lens.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nice Vision Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nice Vision | Professional Photography",
    description: "Capturing timeless stories through the lens.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>

      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-brand-black text-brand-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >

        {children}
        <Toaster position="bottom-right" theme="dark" />

      </body>
    </html>
  );
}
