import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import DataInitializer from "@/components/DataInitializer";
import { ToastProvider } from "@/components/Toast";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

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
  title: "Brightburn Dance & Fitness Studio",
  description: "A premium management app for attendance, fees, students, parents, and studio operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`} suppressHydrationWarning>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen">
        <AmbientBackground />
        <DataInitializer>
          <ToastProvider>{children}</ToastProvider>
        </DataInitializer>
      </body>
    </html>
  );
}
