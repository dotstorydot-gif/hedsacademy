import type { Metadata } from "next";
import { Michroma, Outfit } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  weight: "400",
  variable: "--font-michroma",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEDS Academy | Modern LMS",
  description: "Next-generation Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${michroma.variable} ${outfit.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
