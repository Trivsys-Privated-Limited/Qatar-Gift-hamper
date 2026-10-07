import type { Metadata, Viewport } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { business } from "@/config/business";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReminderNotifier } from "@/components/ReminderNotifier";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${business.name} | Surprise gift hampers in ${business.city}`,
    template: `%s | ${business.name}`,
  },
  description: `Same-day surprise gift hampers delivered across ${business.city}. Order on WhatsApp and never miss a birthday or anniversary again.`,
  icons: { icon: business.logo },
};

export const viewport: Viewport = {
  themeColor: "#F8F3EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body className="min-h-dvh flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ReminderNotifier />
      </body>
    </html>
  );
}
