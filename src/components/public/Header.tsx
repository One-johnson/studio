'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, User, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '../ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 font-headline text-xl">
              <Camera className="h-6 w-6 text-primary" />
              <span>Clustergh</span>
            </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center space-x-2 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={cn(
                    "px-3 py-2 rounded-md transition-colors",
                    pathname === link.href 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 flex justify-end">
             <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
            </Link>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                 </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="p-6">
                    <nav className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                           <Link key={link.href} href={link.href} className={cn(
                                "text-lg font-medium px-3 py-2 rounded-md",
                                pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground"
                            )} onClick={() => setIsMobileMenuOpen(false)}>
                            {link.label}
                           </Link>
                        ))}
                         <Link href="/login" className="text-lg font-medium text-foreground px-3 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Login
                         </Link>
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
