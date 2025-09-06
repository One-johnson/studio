
import PublicLayout from '@/components/layout/PublicLayout';
import { getFeaturedGalleries, getHomepageContent } from '@/lib/data';
import HomePageClient from '@/components/public/HomePageClient';

export default async function HomePage() {
  // Fetch data on the server
  const [featuredGalleries, homepageContent] = await Promise.all([
    getFeaturedGalleries(),
    getHomepageContent(),
  ]);

  return (
    <PublicLayout>
      <HomePageClient
        featuredGalleries={featuredGalleries}
        homepageContent={homepageContent}
      />
    </PublicLayout>
  );
}
