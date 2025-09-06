
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"
import Fade from 'embla-carousel-fade'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Gallery, HomepageContent, Photo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface HomePageClientProps {
    featuredGalleries: Gallery[];
    homepageContent: HomepageContent | null;
    recentPhotos: Photo[];
}

export default function HomePageClient({ featuredGalleries, homepageContent, recentPhotos }: HomePageClientProps) {
  const fadePlugin = useRef(
    Fade({ inViewThreshold: 0.1 })
  )

  const loading = false; // Data is pre-fetched

  return (
    <div className="w-full">
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
          <Carousel
          className="w-full h-full"
          opts={{ loop: true }}
          plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
              fadePlugin.current
          ]}
          >
          <CarouselContent className="h-full">
            {recentPhotos.length > 0 ? (
                recentPhotos.map((photo) => (
                <CarouselItem key={photo.id} className="relative">
                  <Image
                    src={photo.url}
                    alt={photo.title || "Hero background"}
                    fill
                    className="object-cover -z-10"
                    priority
                    data-ai-hint="dramatic landscape"
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-foreground p-8">
                    <p className="mt-2 text-sm text-muted-foreground">Upload photos in the admin panel to see them here.</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {recentPhotos.length > 1 && (
              <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
              </>
          )}
        </Carousel>
        
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 fade-in">
            <h1 className="text-6xl md:text-8xl font-headline text-white">Clustergh</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body">
            {homepageContent?.heroTagline}
            </p>
            <Button asChild size="lg" className="mt-8 font-headline">
            <Link href="/portfolio">
                View Portfolio <ArrowRight className="ml-2" />
            </Link>
            </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
            Featured Galleries
          </h2>
          
          {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                      <Card key={i} className="overflow-hidden group">
                        <CardContent className="p-0">
                          <Skeleton className="w-full aspect-[4/3]" />
                        </CardContent>
                      </Card>
                  ))}
              </div>
          ) : featuredGalleries.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                  <ImageIcon className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">No featured galleries yet</h3>
                  <p className="mt-1 text-sm">Create galleries and add photos to feature them here.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGalleries.map((gallery, index) => (
                  <Card key={gallery.id} className="overflow-hidden group fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-0">
                      <Link href={`/portfolio?category=${gallery.category.toLowerCase()}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                          {gallery.photos && gallery.photos.length > 0 ? (
                          <Image
                              src={gallery.photos[0].url}
                              alt={gallery.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={gallery.title.toLowerCase()}
                          />
                          ) : (
                          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">No image</span>
                          </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="font-headline text-2xl text-white">{gallery.title}</h3>
                          <p className="text-sm text-white/80">{gallery.category}</p>
                          </div>
                      </div>
                      </Link>
                  </CardContent>
                  </Card>
              ))}
              </div>
          )}
        </div>
      </section>
    </div>
  );
}
