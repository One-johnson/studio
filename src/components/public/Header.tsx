
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import logo from '@/images/logo.png';
import { User, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const NavLinkItems = () => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'font-headline text-lg transition-colors hover:text-primary',
              isActive ? 'text-primary' : 'text-foreground'
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex-1 flex justify-start">
            <Link href="/">
                <Image src={logo} alt="Clustergh logo" width={100} priority />
            </Link>
        </div>

        <nav className="hidden flex-2 md:flex justify-center items-center gap-8">
            <NavLinkItems />
        </nav>

        <div className="hidden md:flex flex-1 justify-end">
          <Button asChild variant="ghost" size="icon">
             <Link href="/login">
                <User />
             </Link>
          </Button>
        </div>
        
        <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                     <Link href="/" className="mb-8 block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image src={logo} alt="Clustergh logo" width={120} />
                    </Link>
                    <nav className="flex flex-col gap-6">
                        <NavLinkItems />
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

      </div>
    </header>
  );
}
