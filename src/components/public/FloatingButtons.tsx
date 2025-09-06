
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ContactForm from './ContactForm';

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    if(window.scrollY > 0) {
        setIsAtTop(false);
    } else {
        setIsAtTop(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Dialog>
            <DialogTrigger asChild>
                 <Button size="icon" variant="default" className="rounded-full shadow-lg h-12 w-12" aria-label="Open Contact Form">
                    <Mail className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Send a Message</DialogTitle>
                    <DialogDescription>We typically respond within 24 hours.</DialogDescription>
                </DialogHeader>
                <ContactForm />
            </DialogContent>
        </Dialog>
        {isVisible && (
            <Button
                size="icon"
                variant="outline"
                onClick={isAtTop ? scrollToBottom : scrollToTop}
                className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg h-12 w-12"
                aria-label={isAtTop ? 'Scroll to bottom' : 'Scroll to top'}
            >
                {isAtTop ? <ArrowDown className="h-6 w-6" /> : <ArrowUp className="h-6 w-6" />}
            </Button>
        )}
    </div>
  );
}
