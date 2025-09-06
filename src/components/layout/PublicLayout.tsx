import type { ReactNode } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingButtons from '@/components/public/FloatingButtons';

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
