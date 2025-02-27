import type { Metadata } from "next";
import { radley } from "./fonts/fonts";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickPix",
  description: "Share and rank photos with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/pickpix-logo.svg" type="image/svg+xml" />
      </head>
      <body className={radley.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
