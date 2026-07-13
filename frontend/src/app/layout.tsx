import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Manrope, Geist_Mono, League_Gothic } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

/* ════════════════════════════════════════════════════════════════════════════
   TYPOGRAPHY — matches reference design tokens exactly
   ─────────────────────────────────────────────────────────────────────────
   DISPLAY      Cormorant Garamond — "PRESENCE ISN'T PURCHASED." serif
   SECTION TITLE Manrope Wide      — "DESIGNED WITH INTENT." headings
   Body Text    Inter Regular      — body / UI text
   Caption/Note Inter Light        — small labels
   Mono         Geist Mono         — technical numbers / IDs
   ════════════════════════════════════════════════════════════════════════════ */

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const gothicFont = League_Gothic({
  variable: "--font-gothic",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ASHENRITUAL — Designed With Intent",
    template: "%s — ASHENRITUAL",
  },
  description:
    "Presence isn't purchased. It's cultivated. AshenRitual is not about trends — it's about timeless design, intentional craft, and the discipline to choose less.",
  openGraph: {
    siteName: "ASHENRITUAL",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          cormorantGaramond.variable,
          manrope.variable,
          geistMono.variable,
          gothicFont.variable,
        )}
      >
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#121212",
              border: "1px solid #202020",
              color: "#FDFCFB",
              borderRadius: "0",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              letterSpacing: "0.03em",
            },
          }}
        />

        <Navbar />
        <main id="main-content" role="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
