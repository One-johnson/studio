
'use client';

import type { Gallery, HomepageContent, Testimonial } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';


type HomePageClientProps = {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
  testimonials: Testimonial[];
};

export default function HomePageClient({ featuredGalleries, homepageContent, testimonials }: HomePageClientProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/1800/1000" 
          alt="Hero background" 
          fill
          className="object-cover"
          data-ai-hint="camera lens"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-5xl font-headline mb-4 leading-tight">
            {homepageContent.heroTagline}
          </h1>
          <Button asChild size="lg" className="font-headline text-lg">
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </section>

      {/* Featured Galleries Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGalleries.map((gallery, index) => (
              <Card key={gallery.id} className="overflow-hidden fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-0">
                  <Link href={`/portfolio?category=${gallery.category.toLowerCase()}`}>
                    <Image
                      src={gallery.photos?.[0]?.url || 'https://picsum.photos/600/400'}
                      alt={gallery.photos?.[0]?.title || gallery.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                      data-ai-hint="gallery photo"
                    />
                  </Link>
                </CardContent>
                <CardHeader>
                  <CardTitle className="font-headline">{gallery.title}</CardTitle>
                  <CardDescription>{gallery.photos?.length || 0} photos</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="flex flex-col">
                <CardHeader>
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <CardDescription className="text-base text-foreground flex-grow">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                    <div className="w-full">
                        <p className="font-bold font-headline">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.project}</p>
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
