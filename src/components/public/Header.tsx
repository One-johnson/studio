

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X } from 'lucide-react';
import logo from '@/images/logo.png';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src={logo} alt="Clustergh logo" width={150} priority />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
                <li key={link.href}>
                <Link
                    href={link.href}
                    className={cn(
                    'font-headline text-lg transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-foreground'
                    )}
                >
                    {link.label}
                </Link>
                </li>
            ))}
            </ul>
        </div>
        
        <div className="hidden md:flex items-center justify-end">
            <Link href="/login">
                <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                </Button>
            </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
                <div className="flex flex-col h-full">
                     <div className="flex-shrink-0 p-4">
                        <Link href="/" onClick={() => setIsMenuOpen(false)}>
                            <Image src={logo} alt="Clustergh logo" width={120} />
                        </Link>
                    </div>
                    <ul className="flex flex-col space-y-4 p-4 flex-grow">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                'font-headline text-xl transition-colors hover:text-primary w-full block',
                                pathname === link.href ? 'text-primary' : 'text-foreground'
                                )}
                            >
                                {link.label}
                            </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 border-t">
                         <Link href="/login">
                            <Button variant="outline" className="w-full">
                                <User className="mr-2 h-4 w-4" />
                                Admin Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
