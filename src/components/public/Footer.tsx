
import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Camera className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">clustergh</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} clustergh. All Rights Reserved.
          </p>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <Link href="/portfolio" className="text-sm hover:text-primary transition-colors">Portfolio</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
