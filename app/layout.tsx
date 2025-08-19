'use client'
import "./globals.css";
import { poppins } from '@/app/ui/fonts'
import { PostHogProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${poppins.className} antialiased`}
      >
         <PostHogProvider>
          {children}
         </PostHogProvider>
      </body>
    </html>
  );
}
