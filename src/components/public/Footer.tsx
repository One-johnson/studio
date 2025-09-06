import Image from 'next/image';
import Link from 'next/link';
import logo from '@/images/logo.png';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Copyright */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image src={logo} alt="Clustergh logo" width={150} />
            </Link>
            <p className="text-sm text-muted-foreground">
              Capturing moments, creating memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-headline text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-headline text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <a href="mailto:clusterghmedia@gmail.com" className="hover:text-primary transition-colors">
                  clusterghmedia@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>0241866720 / 0559356400</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Dansoman St, near Hansonic</span>
              </li>
            </ul>
          </div>
          
          {/* Follow Us */}
          <div>
            <h3 className="font-headline text-lg mb-4">Follow Us</h3>
            <div className="flex flex-col space-y-3 text-sm">
                <a href="https://www.facebook.com/clusterghphotography" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                    <span>Clustergh Photography</span>
                </a>
                <a href="https://www.instagram.com/clustergh_photography" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                    <span>Clustergh_photography</span>
                </a>
                 <a href="https://www.instagram.com/clusterfilms" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                    <span>clusterfilms</span>
                </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clustergh. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
