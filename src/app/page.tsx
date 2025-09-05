import Image from 'next/image';
import Link from 'next/link';

import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFeaturedGalleries, getHomepageContent } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const featuredGalleries = await getFeaturedGalleries();
  const homepageContent = await getHomepageContent();

  return (
    <PublicLayout>
      <div className="w-full">
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
          <Image
            src="https://picsum.photos/1920/1080"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            data-ai-hint="dramatic landscape"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4 fade-in">
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tight">
              SnapVerse
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
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
              Featured Galleries
            </h2>
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
             {featuredGalleries.length === 0 && (
                <p className="text-center text-muted-foreground">No featured galleries yet. Add some from the admin panel!</p>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
