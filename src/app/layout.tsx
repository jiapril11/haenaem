import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://haenaem-jet.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "해냄!",
    template: "%s | 해냄!",
  },
  description: "목표를 세우고, 매일 기록하고, 결국 해내는 장기 목표 추적 앱",
  keywords: ["목표 관리", "습관 트래커", "목표 달성", "자기계발", "해냄"],
  authors: [{ name: "해냄!" }],
  creator: "해냄!",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "해냄!",
    title: "해냄! - 장기 목표 추적 앱",
    description: "목표를 세우고, 매일 기록하고, 결국 해내는 장기 목표 추적 앱",
  },
  twitter: {
    card: "summary_large_image",
    title: "해냄! - 장기 목표 추적 앱",
    description: "목표를 세우고, 매일 기록하고, 결국 해내는 장기 목표 추적 앱",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6CBFA8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="min-h-screen bg-[#F8F8F9] text-[#2C2C2A] antialiased">
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`}
        </Script>
      </body>
    </html>
  );
}
