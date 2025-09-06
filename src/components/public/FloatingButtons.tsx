
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUp, ArrowDown, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import ContactForm from './ContactForm';
import Image from 'next/image';
import logo from '@/images/logo.png';
import Link from 'next/link';

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (position > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isAtTop = scrollPosition < 300;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
       {isVisible && (
         <Button
            onClick={isAtTop ? scrollToBottom : scrollToTop}
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
          >
            {isAtTop ? <ArrowDown className="h-6 w-6" /> : <ArrowUp className="h-6 w-6" />}
            <span className="sr-only">{isAtTop ? 'Scroll to bottom' : 'Scroll to top'}</span>
        </Button>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
            >
            <Mail className="h-6 w-6" />
            <span className="sr-only">Open Contact Form</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Contact Us</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-card flex flex-col justify-between rounded-l-lg">
               <div>
                  <Image src={logo} alt="Clustergh logo" width={150} />
                  <h2 className="font-headline text-3xl mt-8">Contact Information</h2>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>
                  <div className="space-y-4 mt-8 text-sm">
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-primary" />
                      <a href="mailto:clusterghmedia@gmail.com" className="hover:text-primary transition-colors">clusterghmedia@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>0241866720 / 0559356400</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Dansoman St, near Hansonic</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-4 mt-8">
                    <Link href="https://www.facebook.com/clustergh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Facebook className="h-6 w-6" />
                    </Link>
                    <Link href="https://www.instagram.com/Clustergh_photography" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Instagram className="h-6 w-6" />
                    </Link>
                     <Link href="https://www.instagram.com/clusterfilms" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Instagram className="h-6 w-6" />
                    </Link>
                </div>
            </div>
            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
