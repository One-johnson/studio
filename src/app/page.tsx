
import PublicLayout from '@/components/layout/PublicLayout';
import { getFeaturedGalleries, getHomepageContent, getTestimonials, getRecentBlogPosts } from '@/lib/data';
import HomePageClient from '@/components/public/HomePageClient';

export default async function HomePage() {
  // Fetch data on the server
  const [featuredGalleries, homepageContent, testimonials, recentPosts] = await Promise.all([
    getFeaturedGalleries(),
    getHomepageContent(),
    getTestimonials(),
    getRecentBlogPosts(3),
  ]);

  return (
    <PublicLayout>
      <HomePageClient
        featuredGalleries={featuredGalleries}
        homepageContent={homepageContent}
        testimonials={testimonials}
        recentPosts={recentPosts}
      />
    </PublicLayout>
  );
}
