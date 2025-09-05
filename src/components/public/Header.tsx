'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          
          {/* Left Side: Brand */}
          <Link href="/" className="flex items-center gap-2 font-headline text-xl">
            <Camera className="h-6 w-6 text-primary" />
            <span>Clustergh</span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-primary p-2 rounded-md",
                      pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side: Login & Mobile Menu */}
          <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-muted-foreground hover:text-primary transition-colors">
                <User className="h-5 w-5" />
              </Link>
              
              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="p-6">
                     <Link href="/" className="flex items-center gap-2 font-headline text-xl mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                        <Camera className="h-6 w-6 text-primary" />
                        <span>Clustergh</span>
                      </Link>
                    <nav>
                      <ul className="space-y-4">
                        {navLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                "text-lg transition-colors hover:text-primary block p-2 rounded-md",
                                pathname === link.href ? "bg-accent text-accent-foreground" : ""
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                         <li>
                           <Link href="/login" className="flex items-center gap-2 text-lg pt-4 mt-4 border-t" onClick={() => setIsMobileMenuOpen(false)}>
                             <User className="h-5 w-5" />
                             Login
                           </Link>
                         </li>
                      </ul>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
