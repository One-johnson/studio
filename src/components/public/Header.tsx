
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, X, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';


const navItems = [
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
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold">
          <Camera className="h-6 w-6 text-primary" />
          <span>Clustergh</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" aria-label="Admin Login">
             <User className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                 <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background">
               <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                     <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                        <Camera className="h-6 w-6 text-primary" />
                        <span>Clustergh</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                 <nav className="flex flex-col gap-6 mt-8 text-lg font-medium">
                    {navItems.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            'transition-colors hover:text-primary',
                            pathname === item.href ? 'text-primary' : 'text-foreground'
                        )}
                        >
                        {item.label}
                        </Link>
                    ))}
                 </nav>
                 <div className="mt-auto border-t pt-4">
                    <Link href="/login" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                         <User className="h-5 w-5" />
                        <span>Admin Login</span>
                    </Link>
                 </div>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
