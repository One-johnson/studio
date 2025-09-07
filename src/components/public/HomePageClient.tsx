
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Gallery, HomepageContent, Testimonial, BlogPost } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, Quote } from 'lucide-react';
import { format } from 'date-fns';

type HomePageClientProps = {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
  testimonials: Testimonial[];
  recentPosts: BlogPost[];
};

export default function HomePageClient({ featuredGalleries, homepageContent, testimonials, recentPosts }: HomePageClientProps) {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="flex flex-col">
      <section className="relative h-[85vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
           <Image
              src="https://picsum.photos/1920/1080"
              alt="Hero background image of a camera lens"
              fill
              className="object-cover"
              priority
              data-ai-hint="camera lens"
            />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 p-4">
          <h1 className="text-4xl md:text-5xl font-headline max-w-4xl animate-fade-in">
            {homepageContent.heroTagline}
          </h1>
          <Button asChild size="lg" className="font-headline animate-fade-in anim-delay-300">
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">Featured Work</h2>
            <p className="text-muted-foreground mt-2">A glimpse into our favorite moments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGalleries.map((gallery, index) => (
              <Link href={`/portfolio?category=${gallery.category.toLowerCase()}`} key={gallery.id}>
                <Card className="overflow-hidden group h-full fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardContent className="p-0 relative aspect-square">
                    {gallery.photos && gallery.photos.length > 0 && (
                      <Image
                        src={gallery.photos[0].url}
                        alt={gallery.photos[0].title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="gallery photo"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-headline text-2xl text-white">{gallery.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
       <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">What Our Clients Say</h2>
          </div>
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-4xl mx-auto"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
                        <Quote className="w-12 h-12 text-primary/20 mb-4" />
                        <p className="text-lg md:text-xl font-body italic mb-6">"{testimonial.quote}"</p>
                        <div className="font-headline text-lg text-foreground font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.project}</div>
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

      {recentPosts && recentPosts.length > 0 && (
         <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-headline">From the Blog</h2>
                  <p className="text-muted-foreground mt-2">Our latest stories and insights</p>
              </div>
               <Button asChild variant="outline">
                  <Link href="/blog">
                    View All Posts <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group flex flex-col">
                   <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-video">
                          <Image 
                            src={post.imageUrl} 
                            alt={post.title} 
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="blog post"
                          />
                      </div>
                   </Link>
                  <CardContent className="p-6 flex-grow flex flex-col">
                      <p className="text-sm text-muted-foreground mb-2">{format(new Date(post.createdAt), 'MMMM d, yyyy')}</p>
                      <h3 className="font-headline text-xl mb-2 flex-grow">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                       <Button asChild variant="link" className="p-0 h-auto justify-start w-fit">
                          <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                       </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
