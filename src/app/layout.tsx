import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpButton } from "@/components/layout/HelpButton";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portafolio | Tecnología En Electrónica Industrial",
  description:
    "Portafolio de proyectos, prácticas y evidencias académicas de Tecnología En Electrónica Industrial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${inter.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <HelpButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
