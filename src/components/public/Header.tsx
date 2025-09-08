
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import logo from '@/images/logo.png';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Clustergh logo" width={120} priority />
        </Link>

        <nav className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-headline text-lg transition-colors hover:text-primary ${
                    pathname === link.href ? 'text-primary' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-2">
           <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                </Link>
            </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full p-4">
                  <Link href="/" className="mb-8" onClick={closeSheet}>
                     <Image src={logo} alt="Clustergh logo" width={150} />
                  </Link>
                  <ul className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                           href={link.href}
                           className={`font-headline text-2xl transition-colors hover:text-primary ${
                            pathname === link.href ? 'text-primary' : ''
                          }`}
                           onClick={closeSheet}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                   <div className="mt-auto">
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={closeSheet}>
                            <User className="mr-2 h-5 w-5" />
                            Admin Login
                        </Link>
                    </Button>
                   </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
