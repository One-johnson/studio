
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import type { Gallery, HomepageContent, Testimonial, BlogPost } from '@/lib/types';
import { format } from 'date-fns';

type HomePageClientProps = {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
  testimonials: Testimonial[];
  recentPosts: BlogPost[];
};

export default function HomePageClient({
  featuredGalleries,
  homepageContent,
  testimonials,
  recentPosts,
}: HomePageClientProps) {
  useEffect(() => {
    // This is a client component, so we can use hooks here.
  }, []);

  const heroGallery = featuredGalleries[0];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] text-white">
        {heroGallery && heroGallery.photos && heroGallery.photos.length > 0 ? (
           <Carousel
            plugins={[
                Autoplay({
                  delay: 5000,
                }),
                Fade()
            ]}
            className="w-full h-full"
            opts={{ loop: true }}
          >
            <CarouselContent className="h-full">
              {heroGallery.photos.slice(0, 5).map((photo) => (
                <CarouselItem key={photo.id} className="h-full">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="hero image"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <p>No hero image available</p>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline max-w-4xl">
              {homepageContent.heroTagline}
            </h1>
            <Button asChild size="lg" className="mt-8 font-headline text-lg">
              <Link href="/portfolio">
                Explore Portfolio <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Galleries Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">Featured Galleries</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover collections that tell a unique story, each captured with a distinct artistic vision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGalleries.map((gallery, index) => (
              <Link key={gallery.id} href={`/portfolio?category=${gallery.category.toLowerCase()}`} className="block group">
                <Card className="overflow-hidden h-full flex flex-col fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative aspect-square">
                    {gallery.photos && gallery.photos[0] ? (
                      <Image
                        src={gallery.photos[0].url}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="gallery photo"
                      />
                    ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-sm text-gray-500">No Image</span>
                        </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <h3 className="font-headline text-2xl">{gallery.title}</h3>
                    <p className="text-muted-foreground mt-2">Explore the {gallery.category} collection.</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
       {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
             <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline">What Our Clients Say</h2>
            </div>
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col justify-between h-full">
                         <CardContent className="p-6">
                            <p className="text-lg font-body italic">"{testimonial.quote}"</p>
                            <div className="mt-4">
                                <p className="font-bold font-headline">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.project}</p>
                            </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      )}

    </div>
  );
}
