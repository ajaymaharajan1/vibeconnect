import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeConnect — Find Your People. Build Your Circle.',
  description: 'Real-world social discovery platform to help people build genuine offline friendships.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
