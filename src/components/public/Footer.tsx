import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/logo.png';
import { Mail, Phone, MapPin } from 'lucide-react';

const navLinks = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and Copyright */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
               <Image src={logo} alt="Clustergh Logo" width={120} />
            </Link>
            <p className="text-sm text-muted-foreground">
              Capturing life's moments, <br /> one frame at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-headline text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
             <h3 className="font-headline text-lg mb-4">Contact Us</h3>
             <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href="mailto:hello@clustergh.com" className="hover:text-primary transition-colors">hello@clustergh.com</a>
                </li>
                <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>123 Photo Lane, Artville, USA</span>
                </li>
             </ul>
          </div>
          
          {/* Placeholder for social or other content */}
          <div>
              <h3 className="font-headline text-lg mb-4">Follow Us</h3>
              <p className="text-sm text-muted-foreground">Social media links coming soon.</p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Clustergh. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
