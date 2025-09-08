
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Quote } from 'lucide-react';
import type { Gallery, HomepageContent, Testimonial, Photo } from '@/lib/types';

interface HomePageClientProps {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
  testimonials: Testimonial[];
  recentPosts: any[]; // Replace 'any' with your BlogPost type if you have one
}

function Hero({ homepageContent }: { homepageContent: HomepageContent }) {
  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
      <Image 
        src="https://picsum.photos/1920/1080" 
        alt="Hero background" 
        fill 
        className="object-cover"
        priority
        data-ai-hint="dramatic landscape"
      />
       <div className="absolute inset-0 bg-black/50" />
      <div className="relative text-center text-white p-4 z-10 fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline leading-tight drop-shadow-md">
          {homepageContent.heroTagline}
        </h1>
        <Button asChild size="lg" className="mt-8 font-headline text-lg">
          <Link href="/portfolio">Explore Portfolio</Link>
        </Button>
      </div>
    </div>
  );
}

function FeaturedGalleries({ galleries }: { galleries: Gallery[] }) {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Featured Galleries</h2>
          <p className="text-muted-foreground mt-2">A glimpse into our favorite collections.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery, index) => (
            <Link href={`/portfolio?category=${gallery.category.toLowerCase()}`} key={gallery.id}>
              <Card className="overflow-hidden group fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-0 relative aspect-[4/3]">
                  {gallery.photos && gallery.photos.length > 0 ? (
                    <Image
                      src={gallery.photos[0].url}
                      alt={gallery.photos[0].title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="gallery photo"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-headline text-2xl text-white">{gallery.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/portfolio">
              View All Galleries <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">What Our Clients Say</h2>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Quote className="w-12 h-12 text-primary/20 mb-4" />
                        <p className="text-foreground/80 flex-grow">&ldquo;{testimonial.quote}&rdquo;</p>
                        <div className="mt-4">
                            <p className="font-bold font-headline text-lg">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.project}</p>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex"/>
          <CarouselNext className="hidden sm:flex"/>
        </Carousel>
      </div>
    </section>
  );
}

export default function HomePageClient({
  featuredGalleries,
  homepageContent,
  testimonials,
}: HomePageClientProps) {
  return (
    <>
      <Hero homepageContent={homepageContent} />
      <FeaturedGalleries galleries={featuredGalleries} />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
