import "./globals.css";
import { poppins } from '@/app/ui/fonts'
import { PostHogProvider } from './posthog-provider'
import { PostHogAuthWrapper } from '@/app/components/posthog-auth-wrapper'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <PostHogProvider>
          <PostHogAuthWrapper>
            {children}
          </PostHogAuthWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}
