import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpButton } from "@/components/layout/HelpButton";
import { ServiceWorker } from "@/components/providers/ServiceWorker";
import { getThemeColor, getThemeCSS } from "@/lib/theme";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Portafolio",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeColor = await getThemeColor();
  const themeCSS = getThemeCSS(themeColor);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="apple-touch-icon" href="/api/pwa-icon?size=192" />
      </head>
      <body
        className={`${orbitron.variable} ${inter.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <HelpButton />
          <ServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  );
}
