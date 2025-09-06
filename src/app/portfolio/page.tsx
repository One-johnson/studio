
'use client';

import { useState, useMemo, Suspense, useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getGalleries, getPhotos } from '@/lib/data';
import type { Gallery, Photo } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Camera } from 'lucide-react';
import { searchPhotos } from '@/ai/flows/ai-search-flow';
import { useToast } from '@/hooks/use-toast';

function PortfolioGrid() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Photo[] | null>(null);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();
  
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [galleriesData, photosData] = await Promise.all([getGalleries(), getPhotos()]);
        setGalleries(galleriesData);
        setAllPhotos(photosData);
      } catch (error) {
        console.error("Failed to fetch portfolio data", error);
        toast({
          title: "Error",
          description: "Could not load portfolio data.",
          variant: "destructive"
        })
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const photosForCategory = useMemo(() => {
    if (activeCategory === 'all') {
      return allPhotos;
    }
    const gallery = galleries.find(g => g.category.toLowerCase() === activeCategory);
    return gallery ? gallery.photos : [];
  }, [activeCategory, allPhotos, galleries]);
  
  const displayedPhotos = searchResults ?? photosForCategory;

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null); // Reset search if query is empty
      return;
    }

    startSearchTransition(async () => {
      try {
        const photosToSearch = allPhotos.map(({ id, title }) => ({ id, title: title || '' }));
        const result = await searchPhotos({ query: searchQuery, photos: photosToSearch });
        
        const foundPhotos = allPhotos.filter(p => result.photoIds.includes(p.id));
        setSearchResults(foundPhotos);

        if (foundPhotos.length === 0) {
            toast({
                title: "No results",
                description: "The AI couldn't find any photos matching your search."
            });
        }
      } catch (error) {
        console.error("AI search failed:", error);
        toast({
          title: 'Search Failed',
          description: 'An error occurred while searching. Please try again.',
          variant: 'destructive'
        });
      }
    });
  };

  if (loading) {
    return (
       <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-8 mb-12">
        <form onSubmit={handleSearch} className="w-full max-w-lg flex gap-2">
          <Input 
            placeholder="e.g., 'serene beach sunset' or 'joyful wedding moments'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Search</span>
          </Button>
        </form>
      
        <Tabs value={activeCategory} onValueChange={(value) => {
            setActiveCategory(value);
            setSearchResults(null); // Reset search when changing category
            setSearchQuery('');
        }} className="inline-block">
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

      {displayedPhotos.length === 0 ? (
        <div className="text-center py-16">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-2xl font-headline mt-4">No Photos Found</h3>
            {searchResults === null ? (
                <p className="text-muted-foreground mt-2">This gallery is empty. Check back later!</p>
            ) : (
                <p className="text-muted-foreground mt-2">Try a different search query or browse another category.</p>
            )}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {displayedPhotos.map((photo, index) => (
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
                <DialogTitle className="sr-only">{photo.title}</DialogTitle>
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
      )}
    </>
  );
}

export default function PortfolioPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-headline text-center mb-4">
          Our Portfolio
        </h1>
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          A collection of moments captured with passion. Use our AI search to find exactly what you're looking for, or browse our curated galleries.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <PortfolioGrid />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
