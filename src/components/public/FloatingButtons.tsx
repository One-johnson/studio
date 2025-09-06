'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ContactForm from '@/components/public/ContactForm';
import logo from '@/images/logo.png';
import Link from 'next/link';

export default function FloatingButtons() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    const handleResize = () => {
        setWindowHeight(window.innerHeight);
        setScrollHeight(document.documentElement.scrollHeight);
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial values
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScrollUpDown = () => {
    if (scrollPosition < windowHeight / 2) {
      // If near top, scroll to bottom
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      // Otherwise, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAtTop = scrollPosition < 100;
  const isAtBottom = (windowHeight + scrollPosition) >= scrollHeight - 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <Button size="icon" className="rounded-full h-12 w-12" onClick={handleScrollUpDown}>
        {isAtTop && !isAtBottom ? <ArrowDown className="h-6 w-6" /> : <ArrowUp className="h-6 w-6" />}
        <span className="sr-only">Scroll</span>
      </Button>

      <Dialog>
        <DialogTrigger asChild>
           <Button size="icon" variant="secondary" className="rounded-full h-12 w-12">
            <Mail className="h-6 w-6" />
            <span className="sr-only">Open Contact Form</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-muted/50 rounded-l-lg flex flex-col justify-between">
                <div>
                    <Image src={logo} alt="Clustergh Logo" width={150} className="mb-8"/>
                    <h3 className="font-headline text-2xl mb-4">Contact Information</h3>
                    <p className="text-muted-foreground mb-8">
                        Fill up the form and our team will get back to you within 24 hours.
                    </p>
                    <div className="space-y-4 text-sm">
                        <a href="tel:0241866720" className="flex items-center gap-3 hover:text-primary">
                            <Phone className="h-4 w-4"/>
                            <span>0241866720 / 0559356400</span>
                        </a>
                        <a href="mailto:clusterghmedia@gmail.com" className="flex items-center gap-3 hover:text-primary">
                            <Mail className="h-4 w-4"/>
                            <span>clusterghmedia@gmail.com</span>
                        </a>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4"/>
                            <span>Dansoman St, near Hansonic</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <Button asChild variant="outline" size="icon">
                       <Link href="https://www.facebook.com/clustergh" target="_blank"><Facebook className="h-4 w-4" /></Link>
                    </Button>
                     <Button asChild variant="outline" size="icon">
                       <Link href="https://www.instagram.com/Clustergh_photography" target="_blank"><Instagram className="h-4 w-4" /></Link>
                    </Button>
                     <Button asChild variant="outline" size="icon">
                       <Link href="https://www.instagram.com/clusterfilms" target="_blank"><Instagram className="h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
            <div className="p-8">
                 <h2 className="font-headline text-3xl mb-4">Get In Touch</h2>
                <ContactForm />
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}