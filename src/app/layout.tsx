import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Präferenzwahl — Demonstrationsmodell",
    template: "%s · Präferenzwahl",
  },
  description:
    "Eine hypothetische Simulation einer Wahl mit drei Präferenzen. Erste Stimme zählt — scheitert sie an der 5%-Hürde, greift die zweite, dann die dritte.",
  applicationName: "Präferenzwahl",
  openGraph: {
    title: "Präferenzwahl — Demonstrationsmodell",
    description:
      "Simulation einer Wahl mit drei Präferenzen und transparent dargestellter Stimmübertragung.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
