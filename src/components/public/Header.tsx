import Link from 'next/link';
import { User, Menu, Camera } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '../ui/button';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-primary">
            <Camera className="h-6 w-6" />
            <span>Clustergh</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.label}
                </Link>
            ))}
        </nav>

        <div className="flex items-center gap-4">
            <Link href="/login">
                <User className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
            </Link>
          
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col p-6">
                    <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-bold font-headline text-primary">
                      <Camera className="h-6 w-6" />
                      <span>Clustergh</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
