import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import DataInitializer from "@/components/DataInitializer";
import { ToastProvider } from "@/components/Toast";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brightburn Studio — Dance & Fitness",
  description: "Dance studio in Kochi. Programs for kids, teens, and adults. QR attendance, parent dashboard, progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <div className="grain-overlay" aria-hidden="true" />
        <DataInitializer>
          <ToastProvider>{children}</ToastProvider>
        </DataInitializer>
      </body>
    </html>
  );
}