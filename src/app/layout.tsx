import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Belleza, Inter } from 'next/font/google';
import CustomCursor from '@/components/public/CustomCursor';

const belleza = Belleza({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-belleza',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Clustergh - Modern Photography Portfolio',
  description: 'A modern photography website to showcase beautiful portfolios.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${belleza.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <CustomCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
