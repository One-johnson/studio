import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"

import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFeaturedGalleries, getHomepageContent, getRecentPhotos } from '@/lib/data';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function HomePage() {
  const featuredGalleries = await getFeaturedGalleries();
  const homepageContent = await getHomepageContent();
  const recentPhotos = await getRecentPhotos(5);

  return (
    <PublicLayout>
      <div className="w-full">
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
           <Carousel 
            className="w-full h-full" 
            opts={{ loop: true }}
            plugins={[
                Autoplay({
                  delay: 5000,
                }),
            ]}
           >
            <CarouselContent className="h-full" effect="fade">
              {recentPhotos.map((photo) => (
                <CarouselItem key={photo.id} className="transition-opacity duration-1000">
                  <Image
                    src={photo.url}
                    alt={photo.title || "Hero background"}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="dramatic landscape"
                  />
                </CarouselItem>
              ))}
               {recentPhotos.length === 0 && (
                <CarouselItem>
                  <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-foreground p-8">
                     <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tight text-primary">
                        clustergh
                    </h1>
                     <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body text-muted-foreground">
                        Your professional photography portfolio awaits.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Upload photos in the admin panel to get started.</p>
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
          { recentPhotos.length > 0 && 
            <>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-4 fade-in">
                    <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tight">
                    clustergh
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body">
                    {homepageContent.heroTagline}
                    </p>
                    <Button asChild size="lg" className="mt-8 font-headline">
                    <Link href="/portfolio">
                        View Portfolio <ArrowRight className="ml-2" />
                    </Link>
                    </Button>
                </div>
            </>
          }
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
              Featured Galleries
            </h2>
            
            {featuredGalleries.length === 0 ? (
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
    </PublicLayout>
  );
}
