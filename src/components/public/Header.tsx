
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Trigger & Brand */}
         <div className="flex items-center md:hidden">
           <button
              className="mr-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <Camera className="h-6 w-6 text-primary" />
            </Link>
         </div>


        {/* Desktop Brand */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Camera className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Clustergh
            </span>
          </Link>
        </div>

        {/* Centered Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-6 text-sm">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'transition-colors hover:text-foreground/80 px-3 py-1 rounded-md',
                  pathname === href ? 'bg-accent text-accent-foreground' : 'text-foreground/60'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Right Aligned Items */}
        <div className="flex flex-1 items-center justify-end space-x-4">
             {/* Centered Mobile Brand Name */}
            <div className="md:hidden">
              <Link href="/" className="font-bold sm:inline-block font-headline" onClick={closeMenu}>Clustergh</Link>
            </div>
             <Link href="/login" className="p-2 rounded-full hover:bg-accent">
                <User className="h-5 w-5" />
             </Link>
        </div>


        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-t border-border/40">
            <nav className="flex flex-col items-start gap-4 p-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-lg',
                     pathname === href ? 'bg-accent text-accent-foreground' : 'text-foreground/80'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
