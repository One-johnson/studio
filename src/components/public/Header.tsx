'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logo from '@/images/logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="Clustergh Logo" width={100} />
          </Link>

          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-headline text-lg transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center justify-end space-x-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User />
                  <span className="sr-only">Login</span>
                </Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col items-center space-y-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-lg font-headline hover:text-primary transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
             <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>Admin Login</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
