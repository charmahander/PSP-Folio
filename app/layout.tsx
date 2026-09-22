import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio | PSP Experience',
  description: 'An interactive portfolio inspired by the Sony PSP 1000',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}












