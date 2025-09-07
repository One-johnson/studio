import { getBlogPostBySlug, getRecentBlogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

type BlogPostPageProps = {
    params: {
        slug: string;
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  const recentPosts = await getRecentBlogPosts(3);

  if (!post) {
    notFound();
  }

  return (
    <PublicLayout>
        <div className="relative h-[50vh] flex items-center justify-center text-center text-white">
             <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                data-ai-hint="blog post"
             />
             <div className="absolute inset-0 bg-black/60" />
             <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-headline max-w-4xl">
                    {post.title}
                </h1>
                <p className="mt-4 text-lg text-white/80">
                    Published on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </p>
             </div>
        </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <article className="lg:col-span-3 prose dark:prose-invert prose-lg max-w-none prose-headings:font-headline prose-h2:text-3xl prose-a:text-primary hover:prose-a:text-primary/80">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <aside className="lg:col-span-1 space-y-8">
            <div className="p-6 rounded-lg bg-secondary">
              <h3 className="font-headline text-2xl mb-4">About this post</h3>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </div>
            
            <div className="p-6 rounded-lg bg-secondary">
              <h3 className="font-headline text-2xl mb-4">Recent Posts</h3>
              <ul className="space-y-4">
                {recentPosts.filter(p => p.id !== post.id).map(recentPost => (
                  <li key={recentPost.id}>
                    <Link href={`/blog/${recentPost.slug}`} className="group">
                        <p className="font-bold group-hover:text-primary transition-colors">{recentPost.title}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(recentPost.createdAt), 'MMM d, yyyy')}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </PublicLayout>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}
