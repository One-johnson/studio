
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import logo from '@/images/logo.png';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const renderNavLink = (href: string, label: string, isMobile: boolean = false) => {
    const isActive = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={cn(
          'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300',
          isActive ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:bg-accent/50',
          isMobile ? 'block text-lg w-full text-center' : 'inline-block'
        )}
      >
        {label}
      </Link>
    );
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Image src={logo} alt="Clustergh logo" className="h-10 w-auto" />
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center">
             <nav className="flex items-center space-x-4">
                {navLinks.map(({ href, label }) => renderNavLink(href, label))}
            </nav>
          </div>

          <div className="hidden md:flex items-center justify-end">
            <Link href="/login" className="p-2 rounded-full hover:bg-accent/50 transition-colors">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground/80 hover:bg-accent/50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center space-y-4 py-8">
            {navLinks.map(({ href, label }) => renderNavLink(href, label, true))}
             <Link href="/login" className="p-2 rounded-full hover:bg-accent/50 transition-colors mt-4">
              <User className="h-6 w-6" />
              <span className="sr-only">Login</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
