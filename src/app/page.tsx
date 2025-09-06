
import PublicLayout from '@/components/layout/PublicLayout';
import { getFeaturedGalleries, getHomepageContent, getRecentPhotos } from '@/lib/data';
import HomePageClient from '@/components/public/HomePageClient';

export default async function HomePage() {
  // Fetch data on the server
  const [featuredGalleries, homepageContent, recentPhotos] = await Promise.all([
    getFeaturedGalleries(),
    getHomepageContent(),
    getRecentPhotos(5)
  ]);

  return (
    <PublicLayout>
      <HomePageClient
        featuredGalleries={featuredGalleries}
        homepageContent={homepageContent}
        recentPhotos={recentPhotos}
      />
    </PublicLayout>
  );
}
