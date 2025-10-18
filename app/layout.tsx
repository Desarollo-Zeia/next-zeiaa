'use client'
import "./globals.css";
import { poppins } from '@/app/ui/fonts'
import { PostHogProvider } from "./providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEffect } from "react";
import { setupErrorMonitoring } from "./lib/monitoring";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    setupErrorMonitoring()
  }, [])

  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
         <PostHogProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
         </PostHogProvider>
      </body>
    </html>
  );
}
