
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Gallery, HomepageContent } from '@/lib/types';

export default function HomePageClient({
  featuredGalleries,
  homepageContent,
}: {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
}) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="Abstract camera lens background"
          fill
          className="object-cover"
          priority
          data-ai-hint="camera lens"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4">
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-white drop-shadow-md">
            {homepageContent.heroTagline}
          </h1>
          <p className="font-body mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
            Timeless images that tell your story.
          </p>
          <Button asChild size="lg" className="mt-8 font-headline">
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </section>

      {/* Featured Galleries Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
            Featured Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGalleries.map((gallery) => (
              <Link href={`/portfolio?category=${gallery.category.toLowerCase()}`} key={gallery.id}>
                <Card className="overflow-hidden group cursor-pointer h-full">
                  <CardContent className="p-0 relative aspect-square">
                    <Image
                      src={gallery.photos?.[0]?.url || 'https://picsum.photos/600/600'}
                      alt={gallery.photos?.[0]?.title || 'Featured gallery image'}
                      width={600}
                      height={600}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="gallery photo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-headline text-2xl text-white">
                        {gallery.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
