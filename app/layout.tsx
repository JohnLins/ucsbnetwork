import type { Metadata } from "next";
import { Inter, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "ucsb.network: The UCSB Accelerator",
  description:
    "An 8-week accelerator for UCSB founders. Weekly 1:1 mentor sessions, a hackathon, and Demo Day in front of VCs and operators."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
