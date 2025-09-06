
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Gallery, HomepageContent } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { searchPhotos } from '@/ai/flows/ai-search-flow';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type HomePageClientProps = {
  featuredGalleries: Gallery[];
  homepageContent: HomepageContent;
};

export default function HomePageClient({ featuredGalleries, homepageContent }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    startSearchTransition(async () => {
      try {
        // In a real app, you'd fetch all photo titles, here we'll just redirect
        // For simplicity, we are redirecting to the portfolio page with the query
        router.push(`/portfolio?search=${encodeURIComponent(searchQuery)}`);
      } catch (error) {
        console.error("AI search failed:", error);
        toast({
          title: 'Search Failed',
          description: 'An error occurred while searching.',
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="Abstract camera lens background"
          fill
          className="object-cover"
          priority
          data-ai-hint="camera lens"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline leading-tight">
            {homepageContent.heroTagline}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Timeless images, unforgettable stories.
          </p>
          <Button asChild size="lg" className="mt-8 font-headline text-lg">
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </section>

      {/* Featured Galleries Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">Featured Galleries</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Explore a curated selection of our favorite moments and breathtaking scenes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGalleries.map((gallery) => (
              <Link href={`/portfolio?category=${gallery.category}`} key={gallery.id}>
                <Card className="overflow-hidden group w-full">
                  <CardContent className="p-0 aspect-video relative">
                    <Image
                      src={gallery.photos?.[0]?.url || `https://picsum.photos/seed/${gallery.id}/600/400`}
                      alt={gallery.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="gallery photo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-headline text-white">{gallery.title}</h3>
                      <p className="text-sm text-white/80 flex items-center gap-2 mt-1">
                        View Gallery <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Search Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center max-w-3xl">
           <h2 className="text-3xl md:text-4xl font-headline">Find Your Perfect Shot</h2>
           <p className="text-muted-foreground mt-2 mb-6">
             Use our AI-powered search to describe the photo you're looking for. Try "joyful wedding dance" or "misty mountain morning".
           </p>
           <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto flex gap-2">
             <Input 
                placeholder="e.g., 'serene beach sunset'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-base"
             />
             <Button type="submit" size="icon" disabled={isSearching}>
                {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                <span className="sr-only">Search</span>
             </Button>
           </form>
        </div>
      </section>
    </div>
  );
}
