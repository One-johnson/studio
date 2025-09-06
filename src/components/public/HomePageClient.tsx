
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import type { Gallery, Photo, HomepageContent } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

type HomePageClientProps = {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
  recentPhotos: Photo[];
};

export default function HomePageClient({
  featuredGalleries,
  homepageContent,
  recentPhotos,
}: HomePageClientProps) {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full text-white">
        <Carousel
          plugins={[autoplayPlugin.current]}
          className="w-full h-full"
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {recentPhotos.map((photo, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint="hero background"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl md:text-6xl font-headline text-white drop-shadow-md mb-6">
                Clustergh
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md mb-8">
                {homepageContent.heroTagline}
            </p>
            <Button asChild size="lg" className="font-headline text-lg">
                <Link href="/portfolio">
                View Portfolio <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>

      {/* Featured Galleries Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">Featured Galleries</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              A glimpse into the diverse stories we've had the honor of telling through our lens.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGalleries.map((gallery, index) => (
              <Link href={`/portfolio?category=${gallery.category.toLowerCase()}`} key={gallery.id}>
                <Card className="overflow-hidden group fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-0 relative aspect-video">
                    {gallery.photos && gallery.photos.length > 0 ? (
                      <Image
                        src={gallery.photos[0].url}
                        alt={gallery.photos[0].title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="gallery cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-2xl font-headline text-white">
                      {gallery.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

