
import PublicLayout from '@/components/layout/PublicLayout';
import { getFeaturedGalleries, getHomepageContent, getTestimonials } from '@/lib/data';
import HomePageClient from '@/components/public/HomePageClient';

export default async function HomePage() {
  // Fetch data on the server
  const [featuredGalleries, homepageContent, testimonials] = await Promise.all([
    getFeaturedGalleries(),
    getHomepageContent(),
    getTestimonials(),
  ]);

  return (
    <PublicLayout>
      <HomePageClient
        featuredGalleries={featuredGalleries}
        homepageContent={homepageContent}
        testimonials={testimonials}
      />
    </PublicLayout>
  );
}
