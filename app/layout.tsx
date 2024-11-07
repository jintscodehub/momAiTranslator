'use client'

import "app/ui/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

import localFont from "next/font/local";


const productSans = localFont({
  src: [
    {
      path: "./ProductSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./ProductSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./ProductSans-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
   <html lang="en" className="{productSans.className}" suppressHydrationWarning>
    <head>
        <title>Mom&apos;s English Assistant</title>
        <meta
          name="description"
          content="An AI-powered assistant to help with English communication"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
        <body className="flex flex-col items-center m-0 bg-blue-100 min-h-screen" suppressHydrationWarning>
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          {children}
          <Analytics />
          </ThemeProvider>
        </body>
    </html>
  );
}
