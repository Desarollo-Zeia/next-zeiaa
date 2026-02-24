import "./globals.css";
import { poppins } from '@/app/ui/fonts'
import { PostHogAuthWrapper } from '@/app/components/posthog-auth-wrapper'
import { PostHogPageTracker } from '@/app/components/posthog-page-tracker'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <PostHogPageTracker />
        <PostHogAuthWrapper>
          {children}
        </PostHogAuthWrapper>
      </body>
    </html>
  );
}
