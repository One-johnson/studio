'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { galleries, photos as allPhotos, Photo } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function PortfolioGrid() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [filter, setFilter] = useState(initialCategory);

  const filteredPhotos = useMemo(() => {
    if (filter === 'all') {
      return allPhotos;
    }
    const gallery = galleries.find(g => g.category.toLowerCase() === filter);
    return gallery ? gallery.photos : [];
  }, [filter]);

  return (
    <>
      <div className="text-center mb-12">
        <Tabs value={filter} onValueChange={setFilter} className="inline-block">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {galleries.map(g => (
              <TabsTrigger key={g.id} value={g.category.toLowerCase()}>
                {g.category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((photo, index) => (
          <Dialog key={photo.id}>
            <DialogTrigger asChild>
              <div className="overflow-hidden rounded-lg cursor-pointer group break-inside-avoid">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-ai-hint="photography"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 border-0">
               <Image
                  src={photo.url}
                  alt={photo.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain rounded-lg"
                  data-ai-hint="photography"
                />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}

export default function PortfolioPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-headline text-center mb-4">
          Our Portfolio
        </h1>
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          A collection of moments captured with passion. Browse through our work and see the world through our eyes.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <PortfolioGrid />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
