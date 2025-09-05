
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Camera className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">clustergh</span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end">
           <Button asChild variant="secondary" className="hidden md:flex">
             <Link href="/login">Admin Login</Link>
           </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-6">
                 <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <Camera className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-lg">clustergh</span>
                </Link>
                <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            'text-lg',
                            pathname === link.href ? 'text-primary font-semibold' : 'text-muted-foreground'
                        )}
                        >
                        {link.label}
                        </Link>
                    ))}
                </nav>
                 <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
                    <Link href="/login">Admin Login</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
