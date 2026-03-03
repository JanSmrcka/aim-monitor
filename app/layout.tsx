import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Sora,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Aim Monitor",
  description: "Tell an AI what you care about. It builds your monitoring task in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
