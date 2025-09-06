
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp, Mail, ArrowDown, Facebook, Instagram, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ContactForm from './ContactForm';
import Image from 'next/image';
import logo from '@/images/logo.png';
import Link from 'next/link';

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    setIsVisible(position > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
  }

  const isAtTop = scrollPosition < 300;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {isVisible && (
             <Button
                size="icon"
                onClick={isAtTop ? scrollToBottom : scrollToTop}
                className="rounded-full w-14 h-14"
                aria-label={isAtTop ? "Scroll to Bottom" : "Scroll to Top"}
            >
                {isAtTop ? <ArrowDown className="h-6 w-6" /> : <ArrowUp className="h-6 w-6" />}
            </Button>
        )}
      
        <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full w-14 h-14" aria-label="Contact">
                <Mail className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
                <DialogTitle className="sr-only">Contact Us</DialogTitle>
                <div className="grid md:grid-cols-2">
                    <div className="p-8 bg-muted/50 rounded-l-lg hidden md:flex flex-col justify-between">
                        <div>
                            <Image src={logo} alt="Clustergh logo" width={150} />
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <a href="mailto:clusterghmedia@gmail.com" className="hover:text-primary transition-colors text-sm">clusterghmedia@gmail.com</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span className="text-sm">0241866720 / 0559356400</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span className="text-sm">Dansoman St, near Hansonic</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="font-headline text-lg mb-4">Follow Us</p>
                            <div className="flex gap-4">
                                <Link href="https://www.facebook.com/profile.php?id=100063543972412" target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
                                </Link>
                                <Link href="https://www.instagram.com/clustergh_photography/" target="_blank" rel="noopener noreferrer">
                                    <Instagram className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
                                </Link>
                                <Link href="https://www.instagram.com/clusterfilms/" target="_blank" rel="noopener noreferrer">
                                     <Instagram className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <h2 className="text-2xl font-headline mb-4">Send a Message</h2>
                        <ContactForm />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
