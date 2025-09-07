import PublicLayout from '@/components/layout/PublicLayout';
import { getBlogPosts } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline">From the Blog</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore our stories, tips, and insights from the world of photography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden group flex flex-col fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                   <Link href={`/blog/${post.slug}`} className="block">
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
                      <h2 className="font-headline text-2xl mb-3 flex-grow">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                      </h2>
                      <p className="text-muted-foreground mb-6">{post.excerpt}</p>
                       <div className="mt-auto">
                           <Button asChild variant="link" className="p-0 h-auto">
                              <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                           </Button>
                       </div>
                  </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </PublicLayout>
  );
}
