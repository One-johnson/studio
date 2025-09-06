'use client';

import PublicLayout from '@/components/layout/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/components/public/ContactForm';

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-headline mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have a question or want to book a session? Fill out the form below or reach out to us directly. We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
              <CardDescription>We typically respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <h2 className="font-headline text-3xl">Contact Information</h2>
            <div className="space-y-4 text-lg">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <a href="mailto:clusterghmedia@gmail.com" className="hover:text-primary transition-colors">clusterghmedia@gmail.com</a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-primary" />
                <span>0241866720 / 0559356400</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Dansoman St, near Hansonic</span>
              </div>
            </div>
             <p className="text-muted-foreground">For a faster response, please use the contact form. We look forward to creating something beautiful together!</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
